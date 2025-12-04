import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Create patient
export const createPatient = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, dateOfBirth, gender, bloodGroup, address, city, state, pincode, emergencyContact } = req.body

    const patient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        bloodGroup,
        address,
        city,
        state,
        pincode,
        emergencyContact
      }
    })

    // Create medical history
    await prisma.medicalHistory.create({
      data: {
        patientId: patient.id,
        allergies: [],
        chronicDiseases: [],
        surgeries: [],
        medications: []
      }
    })

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: patient
    })
  } catch (error: any) {
    console.error('Create patient error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create patient',
      error: error.message
    })
  }
}

// Get all patients with pagination
export const getPatients = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          dateOfBirth: true,
          gender: true,
          bloodGroup: true,
          city: true,
          createdAt: true
        }
      }),
      prisma.patient.count()
    ])

    res.json({
      success: true,
      data: {
        patients,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to get patients',
      error: error.message
    })
  }
}

// Get patient by ID
export const getPatientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        medicalHistory: true,
        appointments: {
          take: 5,
          orderBy: { appointmentDate: 'desc' },
          include: {
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
        },
        prescriptions: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      })
    }

    res.json({
      success: true,
      data: patient
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to get patient',
      error: error.message
    })
  }
}

// Update patient
export const updatePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const patient = await prisma.patient.update({
      where: { id },
      data: updateData
    })

    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: patient
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update patient',
      error: error.message
    })
  }
}

// Delete patient
export const deletePatient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    await prisma.patient.delete({
      where: { id }
    })

    res.json({
      success: true,
      message: 'Patient deleted successfully'
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete patient',
      error: error.message
    })
  }
}

// Get patient medical history
export const getPatientMedicalHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const medicalHistory = await prisma.medicalHistory.findUnique({
      where: { patientId: id }
    })

    res.json({
      success: true,
      data: medicalHistory
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to get medical history',
      error: error.message
    })
  }
}

// Update patient medical history
export const updatePatientMedicalHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { allergies, chronicDiseases, surgeries, familyHistory, medications } = req.body

    const medicalHistory = await prisma.medicalHistory.upsert({
      where: { patientId: id },
      update: {
        allergies,
        chronicDiseases,
        surgeries,
        familyHistory,
        medications
      },
      create: {
        patientId: id,
        allergies: allergies || [],
        chronicDiseases: chronicDiseases || [],
        surgeries: surgeries || [],
        familyHistory,
        medications: medications || []
      }
    })

    res.json({
      success: true,
      message: 'Medical history updated successfully',
      data: medicalHistory
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update medical history',
      error: error.message
    })
  }
}

// Search patients
export const searchPatients = async (req: Request, res: Response) => {
  try {
    const { q } = req.query

    const patients = await prisma.patient.findMany({
      where: {
        OR: [
          { firstName: { contains: q as string, mode: 'insensitive' } },
          { lastName: { contains: q as string, mode: 'insensitive' } },
          { phone: { contains: q as string } },
          { email: { contains: q as string, mode: 'insensitive' } }
        ]
      },
      take: 20,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        gender: true
      }
    })

    res.json({
      success: true,
      data: patients
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    })
  }
}
