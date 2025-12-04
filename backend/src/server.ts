import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import rateLimit from 'express-rate-limit'

// Import routes
import authRoutes from './routes/auth.routes'
import patientRoutes from './routes/patient.routes'
import appointmentRoutes from './routes/appointment.routes'
import prescriptionRoutes from './routes/prescription.routes'
import billingRoutes from './routes/billing.routes'
import telemedicineRoutes from './routes/telemedicine.routes'
import analyticsRoutes from './routes/analytics.routes'
import aiRoutes from './routes/ai.routes'

// Import middleware
import { errorHandler } from './middleware/error.middleware'
import { logger } from './utils/logger'

dotenv.config()

const app: Application = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
})

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }))

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: '2.0.0'
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/prescriptions', prescriptionRoutes)
app.use('/api/billing', billingRoutes)
app.use('/api/telemedicine', telemedicineRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/ai', aiRoutes)

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

// Error handler
app.use(errorHandler)

// Socket.IO for real-time features
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`)

  socket.on('join-consultation', (roomId: string) => {
    socket.join(roomId)
    logger.info(`Socket ${socket.id} joined consultation room ${roomId}`)
    io.to(roomId).emit('user-joined', { socketId: socket.id })
  })

  socket.on('leave-consultation', (roomId: string) => {
    socket.leave(roomId)
    logger.info(`Socket ${socket.id} left consultation room ${roomId}`)
    io.to(roomId).emit('user-left', { socketId: socket.id })
  })

  socket.on('video-offer', (data) => {
    socket.to(data.roomId).emit('video-offer', data)
  })

  socket.on('video-answer', (data) => {
    socket.to(data.roomId).emit('video-answer', data)
  })

  socket.on('ice-candidate', (data) => {
    socket.to(data.roomId).emit('ice-candidate', data)
  })

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`)
  })
})

// Start server
const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  logger.info(`🚀 MediCore EMR Backend running on port ${PORT}`)
  logger.info(`📝 Environment: ${process.env.NODE_ENV}`)
  logger.info(`🔗 API URL: http://localhost:${PORT}`)
  logger.info(`🏥 Health Check: http://localhost:${PORT}/health`)
  logger.info(`🤖 AI Features: Enabled`)
  logger.info(`📹 Telemedicine: Enabled`)
})

export { app, io }
