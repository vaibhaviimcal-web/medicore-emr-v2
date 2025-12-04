import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.middleware'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.use(authenticate)
router.use(authorize(['DOCTOR', 'ADMIN']))

// Get dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalPatients,
      todayAppointments,
      totalPrescriptions,
      monthlyRevenue
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.appointment.count({
        where: {
          appointmentDate: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999))
          }
        }
      }),
      prisma.prescription.count(),
      prisma.billing.aggregate({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          },
          status: 'PAID'
        },
        _sum: {
          totalAmount: true
        }
      })
    ])

    res.json({
      success: true,
      data: {
        totalPatients,
        todayAppointments,
        totalPrescriptions,
        monthlyRevenue: monthlyRevenue._sum.totalAmount || 0
      }
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

export default router
