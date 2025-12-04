import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    ;(req as any).user = decoded
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    })
  }
}

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.role

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      })
    }

    next()
  }
}
