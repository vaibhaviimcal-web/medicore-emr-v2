import { Router } from 'express'
import { body, param, query } from 'express-validator'
import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getPatientMedicalHistory,
  updatePatientMedicalHistory,
  searchPatients
} from '../controllers/patient.controller'
import { authenticate, authorize } from '../middleware/auth.middleware'
import { validate } from '../middleware/validation.middleware'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Create patient
router.post(
  '/',
  authorize(['DOCTOR', 'NURSE', 'RECEPTIONIST', 'ADMIN']),
  [
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
    body('phone').trim().notEmpty(),
    body('dateOfBirth').isISO8601(),
    body('gender').isIn(['MALE', 'FEMALE', 'OTHER']),
    validate
  ],
  createPatient
)

// Get all patients with pagination
router.get(
  '/',
  authorize(['DOCTOR', 'NURSE', 'RECEPTIONIST', 'ADMIN']),
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    validate
  ],
  getPatients
)

// Search patients
router.get(
  '/search',
  authorize(['DOCTOR', 'NURSE', 'RECEPTIONIST', 'ADMIN']),
  [
    query('q').trim().notEmpty(),
    validate
  ],
  searchPatients
)

// Get patient by ID
router.get(
  '/:id',
  authorize(['DOCTOR', 'NURSE', 'RECEPTIONIST', 'ADMIN']),
  [
    param('id').isUUID(),
    validate
  ],
  getPatientById
)

// Update patient
router.put(
  '/:id',
  authorize(['DOCTOR', 'NURSE', 'RECEPTIONIST', 'ADMIN']),
  [
    param('id').isUUID(),
    validate
  ],
  updatePatient
)

// Delete patient
router.delete(
  '/:id',
  authorize(['ADMIN']),
  [
    param('id').isUUID(),
    validate
  ],
  deletePatient
)

// Get patient medical history
router.get(
  '/:id/medical-history',
  authorize(['DOCTOR', 'NURSE', 'ADMIN']),
  [
    param('id').isUUID(),
    validate
  ],
  getPatientMedicalHistory
)

// Update patient medical history
router.put(
  '/:id/medical-history',
  authorize(['DOCTOR', 'ADMIN']),
  [
    param('id').isUUID(),
    validate
  ],
  updatePatientMedicalHistory
)

export default router
