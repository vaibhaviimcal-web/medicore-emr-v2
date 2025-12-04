import { Router } from 'express'
import { body, param } from 'express-validator'
import {
  createConsultation,
  getConsultations,
  getConsultationById,
  startConsultation,
  endConsultation,
  generateAgoraToken
} from '../controllers/telemedicine.controller'
import { authenticate, authorize } from '../middleware/auth.middleware'
import { validate } from '../middleware/validation.middleware'

const router = Router()

router.use(authenticate)

// Create consultation
router.post(
  '/',
  authorize(['DOCTOR', 'ADMIN']),
  [
    body('patientId').isUUID(),
    body('doctorId').isUUID(),
    body('type').isIn(['VIDEO', 'AUDIO', 'CHAT']),
    body('startTime').isISO8601(),
    validate
  ],
  createConsultation
)

// Get consultations
router.get('/', getConsultations)

// Get consultation by ID
router.get('/:id', getConsultationById)

// Start consultation
router.post('/:id/start', startConsultation)

// End consultation
router.post('/:id/end', endConsultation)

// Generate Agora token for video call
router.post('/:id/token', generateAgoraToken)

export default router
