import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { RtcTokenBuilder, RtcRole } from 'agora-access-token'

const prisma = new PrismaClient()

// Create consultation
export const createConsultation = async (req: Request, res: Response) => {
  try {
    const { patientId, doctorId, type, startTime, notes } = req.body

    const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const consultation = await prisma.consultation.create({
      data: {
        patientId,
        doctorId,
        type,
        startTime: new Date(startTime),
        roomId,
        notes,
        status: 'SCHEDULED'
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true
          }
        },
        doctor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })

    res.status(201).json({
      success: true,
      message: 'Consultation scheduled successfully',
      data: consultation
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create consultation',
      error: error.message
    })
  }
}

// Get consultations
export const getConsultations = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId
    const userRole = (req as any).user.role

    let consultations

    if (userRole === 'DOCTOR') {
      const doctor = await prisma.doctor.findUnique({ where: { userId } })
      consultations = await prisma.consultation.findMany({
        where: { doctorId: doctor?.id },
        include: {
          patient: true,
          doctor: {
            include: {
              user: true
            }
          }
        },
        orderBy: { startTime: 'desc' }
      })
    } else {
      consultations = await prisma.consultation.findMany({
        include: {
          patient: true,
          doctor: {
            include: {
              user: true
            }
          }
        },
        orderBy: { startTime: 'desc' }
      })
    }

    res.json({
      success: true,
      data: consultations
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to get consultations',
      error: error.message
    })
  }
}

// Get consultation by ID
export const getConsultationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const consultation = await prisma.consultation.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: {
          include: {
            user: true
          }
        }
      }
    })

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      })
    }

    res.json({
      success: true,
      data: consultation
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to get consultation',
      error: error.message
    })
  }
}

// Start consultation
export const startConsultation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const consultation = await prisma.consultation.update({
      where: { id },
      data: {
        status: 'IN_PROGRESS',
        startTime: new Date()
      }
    })

    res.json({
      success: true,
      message: 'Consultation started',
      data: consultation
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to start consultation',
      error: error.message
    })
  }
}

// End consultation
export const endConsultation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { notes } = req.body

    const consultation = await prisma.consultation.findUnique({
      where: { id }
    })

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      })
    }

    const duration = Math.floor(
      (new Date().getTime() - new Date(consultation.startTime).getTime()) / 1000 / 60
    )

    const updatedConsultation = await prisma.consultation.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        endTime: new Date(),
        duration,
        notes
      }
    })

    res.json({
      success: true,
      message: 'Consultation ended',
      data: updatedConsultation
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to end consultation',
      error: error.message
    })
  }
}

// Generate Agora token for video call
export const generateAgoraToken = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = (req as any).user.userId

    const consultation = await prisma.consultation.findUnique({
      where: { id }
    })

    if (!consultation || !consultation.roomId) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      })
    }

    const appId = process.env.AGORA_APP_ID || ''
    const appCertificate = process.env.AGORA_APP_CERTIFICATE || ''
    const channelName = consultation.roomId
    const uid = 0 // 0 means auto-assign
    const role = RtcRole.PUBLISHER
    const expirationTimeInSeconds = 3600
    const currentTimestamp = Math.floor(Date.now() / 1000)
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    )

    res.json({
      success: true,
      data: {
        token,
        channelName,
        appId,
        uid
      }
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate token',
      error: error.message
    })
  }
}
