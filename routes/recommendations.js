import express from 'express';
import Recommendation from '../models/Recommendation.js';
import GapAnalysis from '../models/GapAnalysis.js';
import Assessment from '../models/Assessment.js';
import { getQuestions } from '../data/questions.js';

const router = express.Router();

// Generate recommendations for an assessment
router.post('/generate/:assessmentId', async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.assessmentId);
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    // Get gap analysis
    const gapAnalysis = await GapAnalysis.findOne({ assessmentId: req.params.assessmentId });
    if (!gapAnalysis) {
      return res.status(404).json({ 
        success: false, 
        message: 'Gap analysis not found. Generate it first.' 
      });
    }

    // Check if recommendations already exist
    let recommendation = await Recommendation.findOne({ assessmentId: req.params.assessmentId });
    
    if (recommendation) {
      await Recommendation.findByIdAndDelete(recommendation._id);
    }

    // Generate action plan from gaps
    const actionPlan = generateActionPlan(gapAnalysis.gaps, assessment);

    recommendation = new Recommendation({
      assessmentId: assessment._id,
      bankId: assessment.bankId,
      actionPlan,
      status: 'draft'
    });

    await recommendation.save();

    res.json({
      success: true,
      data: recommendation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get recommendations for an assessment
router.get('/assessment/:assessmentId', async (req, res) => {
  try {
    const recommendation = await Recommendation.findOne({ assessmentId: req.params.assessmentId })
      .populate('assessmentId')
      .populate('bankId', 'name code');

    if (!recommendation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Recommendations not found. Generate them first.' 
      });
    }

    res.json({ success: true, data: recommendation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get recommendations for current user's bank
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

    const recommendation = await Recommendation.findOne({ assessmentId: latestAssessment._id })
      .populate('assessmentId')
      .populate('bankId', 'name code');

    if (!recommendation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Recommendations not found. Generate them first.' 
      });
    }

    res.json({ success: true, data: recommendation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update recommendation status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const recommendation = await Recommendation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!recommendation) {
      return res.status(404).json({ success: false, message: 'Recommendation not found' });
    }

    res.json({ success: true, data: recommendation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update action item
router.put('/:id/action-item/:itemIndex', async (req, res) => {
  try {
    const recommendation = await Recommendation.findById(req.params.id);
    if (!recommendation) {
      return res.status(404).json({ success: false, message: 'Recommendation not found' });
    }

    const itemIndex = parseInt(req.params.itemIndex);
    if (itemIndex < 0 || itemIndex >= recommendation.actionPlan.length) {
      return res.status(400).json({ success: false, message: 'Invalid action item index' });
    }

    recommendation.actionPlan[itemIndex] = {
      ...recommendation.actionPlan[itemIndex],
      ...req.body
    };

    await recommendation.save();
    res.json({ success: true, data: recommendation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Helper function to generate action plan
function generateActionPlan(gaps, assessment) {
  const actionPlan = [];
  const questions = getQuestions();

  gaps.forEach((gap, index) => {
    const question = questions.find(q => q.id === gap.questionId);
    if (!question) return;

    const actionItem = {
      title: `Address ${question.category} Gap: ${question.question.substring(0, 60)}...`,
      description: generateRecommendationDescription(gap, question),
      component: gap.component,
      priority: gap.priority,
      estimatedEffort: estimateEffort(gap),
      estimatedTimeframe: estimateTimeframe(gap),
      resources: generateResources(gap.component, gap.priority),
      relatedGapId: gap.questionId
    };

    actionPlan.push(actionItem);
  });

  return actionPlan;
}

function generateRecommendationDescription(gap, question) {
  const descriptions = {
    critical: `Critical gap identified. Current score: ${gap.currentScore}/5. Immediate action required to address ${question.category.toLowerCase()} concerns. This is a high-priority area that significantly impacts forensic readiness.`,
    high: `High-priority gap identified. Current score: ${gap.currentScore}/5. Significant improvement needed in ${question.category.toLowerCase()} to enhance forensic readiness capabilities.`,
    medium: `Medium-priority gap identified. Current score: ${gap.currentScore}/5. Improvement recommended in ${question.category.toLowerCase()} to strengthen forensic readiness.`,
    low: `Low-priority gap identified. Current score: ${gap.currentScore}/5. Minor enhancement suggested in ${question.category.toLowerCase()} to optimize forensic readiness.`
  };

  return descriptions[gap.priority] || descriptions.medium;
}

function estimateEffort(gap) {
  if (gap.priority === 'critical' || gap.gap >= 4) return 'high';
  if (gap.priority === 'high' || gap.gap >= 3) return 'medium';
  return 'low';
}

function estimateTimeframe(gap) {
  if (gap.priority === 'critical') return '1-3 months';
  if (gap.priority === 'high') return '3-6 months';
  if (gap.priority === 'medium') return '6-12 months';
  return '12+ months';
}

function generateResources(component, priority) {
  const baseResources = [
    'CBN Cybersecurity Framework',
    'ISO 27037 Guidelines',
    'NIST Digital Forensics Guide'
  ];

  const componentResources = {
    governance: ['Governance Framework Template', 'Policy Development Guide'],
    people: ['Training Program Outline', 'Certification Roadmap'],
    processes: ['Incident Response Template', 'Evidence Handling Procedures'],
    technology: ['Tool Selection Guide', 'Lab Setup Checklist'],
    data: ['Data Classification Guide', 'Retention Policy Template'],
    compliance: ['Regulatory Compliance Checklist', 'Audit Preparation Guide']
  };

  return [...baseResources, ...(componentResources[component] || [])];
}

export default router;

