import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.use(authenticate)

// Create billing
router.post('/', async (req, res) => {
  try {
    const { patientId, items, tax, discount } = req.body

    const amount = items.reduce((sum: number, item: any) => sum + item.totalPrice, 0)
    const totalAmount = amount + (tax || 0) - (discount || 0)
    const invoiceNumber = `INV-${Date.now()}`

    const billing = await prisma.billing.create({
      data: {
        patientId,
        invoiceNumber,
        amount,
        tax: tax || 0,
        discount: discount || 0,
        totalAmount,
        items: {
          create: items
        }
      },
      include: {
        items: true,
        patient: true
      }
    })

    res.status(201).json({
      success: true,
      data: billing
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get billings
router.get('/', async (req, res) => {
  try {
    const billings = await prisma.billing.findMany({
      include: {
        items: true,
        patient: true
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json({
      success: true,
      data: billings
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

export default router
