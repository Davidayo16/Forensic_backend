import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import assessmentRoutes from './routes/assessments.js';
import bankRoutes from './routes/banks.js';
import dashboardRoutes from './routes/dashboard.js';
import gapAnalysisRoutes from './routes/gapAnalysis.js';
import recommendationRoutes from './routes/recommendations.js';
import reportRoutes from './routes/reports.js';
import resourceRoutes from './routes/resources.js';
import { authenticate } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/forensic-readiness';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((error) => console.error('❌ MongoDB connection error:', error));

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes (require authentication)
app.use('/api/assessments', authenticate, assessmentRoutes);
app.use('/api/banks', authenticate, bankRoutes);
app.use('/api/dashboard', authenticate, dashboardRoutes);
app.use('/api/gap-analysis', authenticate, gapAnalysisRoutes);
app.use('/api/recommendations', authenticate, recommendationRoutes);
app.use('/api/reports', authenticate, reportRoutes);
app.use('/api/resources', resourceRoutes); // Resources can be public

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Forensic Readiness API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

