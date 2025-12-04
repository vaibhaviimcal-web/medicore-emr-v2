import { Router } from 'express'
import { body } from 'express-validator'
import { 
  register, 
  login, 
  logout, 
  refreshToken, 
  forgotPassword, 
  resetPassword,
  verifyEmail,
  getCurrentUser
} from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validation.middleware'

const router = Router()

// Register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
    body('role').isIn(['DOCTOR', 'NURSE', 'RECEPTIONIST', 'ADMIN']),
    validate
  ],
  register
)

// Login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
    validate
  ],
  login
)

// Logout
router.post('/logout', authenticate, logout)

// Refresh token
router.post('/refresh-token', refreshToken)

// Forgot password
router.post(
  '/forgot-password',
  [
    body('email').isEmail().normalizeEmail(),
    validate
  ],
  forgotPassword
)

// Reset password
router.post(
  '/reset-password',
  [
    body('token').notEmpty(),
    body('password').isLength({ min: 8 }),
    validate
  ],
  resetPassword
)

// Verify email
router.get('/verify-email/:token', verifyEmail)

// Get current user
router.get('/me', authenticate, getCurrentUser)

export default router
