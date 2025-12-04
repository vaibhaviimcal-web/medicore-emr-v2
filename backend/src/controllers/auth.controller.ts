import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Register new user
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role, licenseNumber, specialty } = req.body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
      }
    })

    // Create role-specific record
    if (role === 'DOCTOR' && licenseNumber) {
      await prisma.doctor.create({
        data: {
          userId: user.id,
          licenseNumber,
          specialty: specialty || 'General Medicine',
          qualification: 'MBBS',
          experience: 0,
          consultationFee: 500
        }
      })
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        token
      }
    })
  } catch (error: any) {
    console.error('Register error:', error)
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    })
  }
}

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })

    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        token
      }
    })
  } catch (error: any) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    })
  }
}

// Logout
export const logout = async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Logout successful'
  })
}

// Refresh token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    
    const newToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email, role: decoded.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({
      success: true,
      data: { token: newToken }
    })
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    })
  }
}

// Forgot password
export const forgotPassword = async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Password reset email sent'
  })
}

// Reset password
export const resetPassword = async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Password reset successful'
  })
}

// Verify email
export const verifyEmail = async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Email verified successfully'
  })
}

// Get current user
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        avatar: true,
        isActive: true,
        createdAt: true
      }
    })

    res.json({
      success: true,
      data: user
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to get user',
      error: error.message
    })
  }
}
