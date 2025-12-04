import { Router } from 'express'
import { body } from 'express-validator'
import { authenticate, authorize } from '../middleware/auth.middleware'
import { validate } from '../middleware/validation.middleware'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.use(authenticate)

// Create appointment
router.post(
  '/',
  [
    body('patientId').isUUID(),
    body('doctorId').isUUID(),
    body('appointmentDate').isISO8601(),
    body('type').isIn(['IN_PERSON', 'VIDEO_CALL', 'PHONE_CALL']),
    validate
  ],
  async (req, res) => {
    try {
      const appointment = await prisma.appointment.create({
        data: {
          ...req.body,
          appointmentDate: new Date(req.body.appointmentDate)
        },
        include: {
          patient: true,
          doctor: {
            include: {
              user: true
            }
          }
        }
      })

      res.status(201).json({
        success: true,
        data: appointment
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }
)

// Get appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: true,
        doctor: {
          include: {
            user: true
          }
        }
      },
      orderBy: { appointmentDate: 'desc' }
    })

    res.json({
      success: true,
      data: appointments
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

export default router
