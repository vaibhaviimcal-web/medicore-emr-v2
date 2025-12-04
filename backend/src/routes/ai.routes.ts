import { Router } from 'express'
import { body } from 'express-validator'
import { AIService } from '../services/ai.service'
import { authenticate, authorize } from '../middleware/auth.middleware'
import { validate } from '../middleware/validation.middleware'

const router = Router()

router.use(authenticate)
router.use(authorize(['DOCTOR', 'ADMIN']))

// Get clinical suggestions
router.post(
  '/clinical-suggestions',
  [
    body('symptoms').isArray().notEmpty(),
    validate
  ],
  async (req, res) => {
    try {
      const { symptoms, patientHistory } = req.body
      const result = await AIService.getClinicalSuggestions(symptoms, patientHistory)
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data
        })
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to get clinical suggestions',
          error: result.error
        })
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'AI service error',
        error: error.message
      })
    }
  }
)

// Check drug interactions
router.post(
  '/drug-interactions',
  [
    body('medications').isArray().notEmpty(),
    validate
  ],
  async (req, res) => {
    try {
      const { medications } = req.body
      const result = await AIService.checkDrugInteractions(medications)
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data
        })
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to check drug interactions',
          error: result.error
        })
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'AI service error',
        error: error.message
      })
    }
  }
)

// Generate prescription summary
router.post(
  '/prescription-summary',
  [
    body('diagnosis').notEmpty(),
    body('medications').isArray(),
    validate
  ],
  async (req, res) => {
    try {
      const result = await AIService.generatePrescriptionSummary(req.body)
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data
        })
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to generate summary',
          error: result.error
        })
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'AI service error',
        error: error.message
      })
    }
  }
)

// Process medical transcription
router.post(
  '/transcription',
  [
    body('transcription').notEmpty(),
    validate
  ],
  async (req, res) => {
    try {
      const { transcription } = req.body
      const result = await AIService.processTranscription(transcription)
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data
        })
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to process transcription',
          error: result.error
        })
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'AI service error',
        error: error.message
      })
    }
  }
)

export default router
