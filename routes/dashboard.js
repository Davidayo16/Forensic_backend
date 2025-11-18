import express from 'express';
import Assessment from '../models/Assessment.js';
import Bank from '../models/Bank.js';

const router = express.Router();

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const totalBanks = await Bank.countDocuments({ status: 'active' });
    const totalAssessments = await Assessment.countDocuments({ status: 'submitted' });
    
    // Get average scores
    const assessments = await Assessment.find({ status: 'submitted' });
    const avgScores = calculateAverageScores(assessments);
    
    // Get recent assessments
    const recentAssessments = await Assessment.find({ status: 'submitted' })
      .populate('bankId', 'name code')
      .sort({ submittedAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalBanks,
        totalAssessments,
        averageScores: avgScores,
        recentAssessments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get bank-specific dashboard
router.get('/bank', async (req, res) => {
  try {
    const bankId = req.user.role === 'system_admin' && req.query.bankId 
      ? req.query.bankId 
      : req.user.bankId;
    
    const bank = await Bank.findById(bankId);
    if (!bank) {
      return res.status(404).json({ success: false, message: 'Bank not found' });
    }
    
    // Check access - compare ObjectIds properly
    const userBankId = req.user.bankId;
    if (req.user.role !== 'system_admin') {
      const userBankIdStr = userBankId?.toString?.() || userBankId?.toString() || String(userBankId);
      const bankIdStr = bank._id.toString();
      if (bankIdStr !== userBankIdStr) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    const assessments = await Assessment.find({ bankId: bankId })
      .sort({ assessmentDate: -1 });

    const latestAssessment = assessments[0];
    const previousAssessment = assessments[1];

    // Calculate progress
    const progress = calculateProgress(latestAssessment, previousAssessment);

    // Get trend data
    const trendData = assessments.map(ass => ({
      date: ass.assessmentDate,
      overallScore: ass.scores.overall.percentage,
      components: {
        governance: ass.scores.governance.percentage,
        people: ass.scores.people.percentage,
        processes: ass.scores.processes.percentage,
        technology: ass.scores.technology.percentage,
        data: ass.scores.data.percentage,
        compliance: ass.scores.compliance.percentage
      }
    }));

    res.json({
      success: true,
      data: {
        bank,
        latestAssessment,
        previousAssessment,
        progress,
        trendData,
        totalAssessments: assessments.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Legacy route for backward compatibility
router.get('/bank/:bankId', async (req, res) => {
  req.query.bankId = req.params.bankId;
  // Reuse the above handler
  return router.stack.find(layer => layer.route.path === '/bank').route.stack[0].handle(req, res);
});

// Get component-wise statistics
router.get('/components', async (req, res) => {
  try {
    const assessments = await Assessment.find({ status: 'submitted' });
    const componentStats = calculateComponentStatistics(assessments);

    res.json({
      success: true,
      data: componentStats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Helper functions
function calculateAverageScores(assessments) {
  if (assessments.length === 0) {
    return {
      overall: 0,
      governance: 0,
      people: 0,
      processes: 0,
      technology: 0,
      data: 0,
      compliance: 0
    };
  }

  const totals = {
    overall: 0,
    governance: 0,
    people: 0,
    processes: 0,
    technology: 0,
    data: 0,
    compliance: 0
  };

  assessments.forEach(ass => {
    totals.overall += ass.scores.overall.percentage;
    totals.governance += ass.scores.governance.percentage;
    totals.people += ass.scores.people.percentage;
    totals.processes += ass.scores.processes.percentage;
    totals.technology += ass.scores.technology.percentage;
    totals.data += ass.scores.data.percentage;
    totals.compliance += ass.scores.compliance.percentage;
  });

  const count = assessments.length;
  return {
    overall: Math.round(totals.overall / count),
    governance: Math.round(totals.governance / count),
    people: Math.round(totals.people / count),
    processes: Math.round(totals.processes / count),
    technology: Math.round(totals.technology / count),
    data: Math.round(totals.data / count),
    compliance: Math.round(totals.compliance / count)
  };
}

function calculateProgress(latest, previous) {
  if (!latest || !previous) {
    return {
      overall: 0,
      components: {}
    };
  }

  const components = ['governance', 'people', 'processes', 'technology', 'data', 'compliance'];
  const progress = {
    overall: latest.scores.overall.percentage - previous.scores.overall.percentage,
    components: {}
  };

  components.forEach(comp => {
    progress.components[comp] = 
      latest.scores[comp].percentage - previous.scores[comp].percentage;
  });

  return progress;
}

function calculateComponentStatistics(assessments) {
  const components = ['governance', 'people', 'processes', 'technology', 'data', 'compliance'];
  const stats = {};

  components.forEach(comp => {
    const scores = assessments.map(a => a.scores[comp].percentage);
    stats[comp] = {
      average: scores.length > 0 
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
        : 0,
      min: scores.length > 0 ? Math.min(...scores) : 0,
      max: scores.length > 0 ? Math.max(...scores) : 0,
      count: assessments.length
    };
  });

  return stats;
}

export default router;

