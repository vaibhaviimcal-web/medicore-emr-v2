import { Router } from 'express'
import { body } from 'express-validator'
import { authenticate, authorize } from '../middleware/auth.middleware'
import { validate } from '../middleware/validation.middleware'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.use(authenticate)

// Create prescription
router.post(
  '/',
  authorize(['DOCTOR', 'ADMIN']),
  [
    body('patientId').isUUID(),
    body('doctorId').isUUID(),
    body('diagnosis').notEmpty(),
    body('medications').isArray(),
    validate
  ],
  async (req, res) => {
    try {
      const { patientId, doctorId, diagnosis, symptoms, medications, instructions, followUpDate } = req.body

      const prescription = await prisma.prescription.create({
        data: {
          patientId,
          doctorId,
          diagnosis,
          symptoms: symptoms || [],
          instructions,
          followUpDate: followUpDate ? new Date(followUpDate) : null,
          medications: {
            create: medications
          }
        },
        include: {
          medications: true,
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
        data: prescription
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }
)

// Get prescriptions
router.get('/', async (req, res) => {
  try {
    const prescriptions = await prisma.prescription.findMany({
      include: {
        medications: true,
        patient: true,
        doctor: {
          include: {
            user: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json({
      success: true,
      data: prescriptions
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

export default router
