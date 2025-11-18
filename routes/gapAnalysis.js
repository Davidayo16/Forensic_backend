import express from 'express';
import Assessment from '../models/Assessment.js';
import GapAnalysis from '../models/GapAnalysis.js';
import { getQuestions } from '../data/questions.js';

const router = express.Router();

// Generate gap analysis for an assessment
router.post('/generate/:assessmentId', async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.assessmentId);
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    // Check if gap analysis already exists
    let gapAnalysis = await GapAnalysis.findOne({ assessmentId: req.params.assessmentId });
    
    if (gapAnalysis) {
      // Regenerate if exists
      await GapAnalysis.findByIdAndDelete(gapAnalysis._id);
    }

    // Generate gaps
    const gaps = generateGaps(assessment);
    const summary = calculateGapSummary(gaps);
    const componentGaps = calculateComponentGaps(gaps);

    gapAnalysis = new GapAnalysis({
      assessmentId: assessment._id,
      bankId: assessment.bankId,
      gaps,
      summary,
      componentGaps
    });

    await gapAnalysis.save();

    res.json({
      success: true,
      data: gapAnalysis
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get gap analysis for an assessment
router.get('/assessment/:assessmentId', async (req, res) => {
  try {
    const gapAnalysis = await GapAnalysis.findOne({ assessmentId: req.params.assessmentId })
      .populate('assessmentId')
      .populate('bankId', 'name code');

    if (!gapAnalysis) {
      return res.status(404).json({ 
        success: false, 
        message: 'Gap analysis not found. Generate it first.' 
      });
    }

    res.json({ success: true, data: gapAnalysis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get gap analysis for current user's bank
router.get('/bank', async (req, res) => {
  try {
    const bankId = req.user.role === 'system_admin' && req.query.bankId 
      ? req.query.bankId 
      : req.user.bankId;
    
    const latestAssessment = await Assessment.findOne({ bankId })
      .sort({ assessmentDate: -1 });

    if (!latestAssessment) {
      return res.status(404).json({ 
        success: false, 
        message: 'No assessment found for this bank' 
      });
    }

    const gapAnalysis = await GapAnalysis.findOne({ assessmentId: latestAssessment._id })
      .populate('assessmentId')
      .populate('bankId', 'name code');

    if (!gapAnalysis) {
      return res.status(404).json({ 
        success: false, 
        message: 'Gap analysis not found. Generate it first.' 
      });
    }

    res.json({ success: true, data: gapAnalysis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Helper functions
function generateGaps(assessment) {
  const questions = getQuestions();
  const gaps = [];
  const targetScore = 5; // Maximum score

  assessment.answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) return;

    const currentScore = answer.answer;
    const gap = targetScore - currentScore;

    if (gap > 0) {
      const priority = determinePriority(gap, currentScore);
      
      gaps.push({
        component: answer.component,
        questionId: answer.questionId,
        currentScore,
        targetScore,
        gap,
        priority,
        description: `Gap in ${question.category}: ${question.question}`
      });
    }
  });

  // Sort by priority and gap size
  gaps.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.gap - a.gap;
  });

  return gaps;
}

function determinePriority(gap, currentScore) {
  if (gap >= 4 || currentScore === 1) return 'critical';
  if (gap >= 3 || currentScore === 2) return 'high';
  if (gap >= 2) return 'medium';
  return 'low';
}

function calculateGapSummary(gaps) {
  return {
    totalGaps: gaps.length,
    criticalGaps: gaps.filter(g => g.priority === 'critical').length,
    highPriorityGaps: gaps.filter(g => g.priority === 'high').length,
    mediumPriorityGaps: gaps.filter(g => g.priority === 'medium').length,
    lowPriorityGaps: gaps.filter(g => g.priority === 'low').length
  };
}

function calculateComponentGaps(gaps) {
  const components = ['governance', 'people', 'processes', 'technology', 'data', 'compliance'];
  const componentGaps = {};

  components.forEach(comp => {
    componentGaps[comp] = gaps.filter(g => g.component === comp).length;
  });

  return componentGaps;
}

export default router;

