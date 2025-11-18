import express from 'express';
import Assessment from '../models/Assessment.js';
import { calculateScores } from '../utils/scoreCalculator.js';
import { getQuestions } from '../data/questions.js';
import { authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all questions
router.get('/questions', (req, res) => {
  try {
    const questions = getQuestions();
    res.json({ success: true, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all assessments
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { bankId: req.user.bankId }; // Users can only see their bank's assessments
    
    // System admin can see all
    if (req.user.role === 'system_admin') {
      delete filter.bankId;
      if (req.query.bankId) filter.bankId = req.query.bankId;
    }
    
    if (status) filter.status = status;

    const assessments = await Assessment.find(filter)
      .populate('bankId', 'name code')
      .sort({ assessmentDate: -1 });
    
    res.json({ success: true, data: assessments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single assessment
router.get('/:id', async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('bankId', 'name code email');
    
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }
    
    // Check if user has access to this assessment
    if (req.user.role !== 'system_admin' && assessment.bankId.toString() !== req.user.bankId.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    res.json({ success: true, data: assessment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new assessment
router.post('/', async (req, res) => {
  try {
    const { answers } = req.body;
    
    // Use authenticated user's bank
    const bankId = req.user.bankId;
    const bankName = req.user.bankName;

    // Calculate scores
    const scores = calculateScores(answers);

    const assessment = new Assessment({
      bankId,
      bankName,
      answers,
      scores,
      status: 'draft'
    });

    await assessment.save();
    res.status(201).json({ success: true, data: assessment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update assessment
router.put('/:id', async (req, res) => {
  try {
    const { answers, status } = req.body;
    
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    // Update answers and recalculate scores
    if (answers) {
      assessment.answers = answers;
      assessment.scores = calculateScores(answers);
    }

    if (status) {
      assessment.status = status;
      if (status === 'submitted' && !assessment.submittedAt) {
        assessment.submittedAt = new Date();
      }
    }

    await assessment.save();
    res.json({ success: true, data: assessment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Submit assessment
router.post('/:id/submit', async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    assessment.status = 'submitted';
    assessment.submittedAt = new Date();
    await assessment.save();

    res.json({ success: true, data: assessment, message: 'Assessment submitted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Get assessment history for current user's bank
router.get('/history', async (req, res) => {
  try {
    const filter = { bankId: req.user.bankId };
    
    // System admin can view any bank's history
    if (req.user.role === 'system_admin' && req.query.bankId) {
      filter.bankId = req.query.bankId;
    }
    
    const assessments = await Assessment.find(filter)
      .sort({ assessmentDate: -1 });
    
    res.json({ success: true, data: assessments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete assessment
router.delete('/:id', async (req, res) => {
  try {
    const assessment = await Assessment.findByIdAndDelete(req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }
    res.json({ success: true, message: 'Assessment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

