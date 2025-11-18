import express from 'express';
import Assessment from '../models/Assessment.js';
import GapAnalysis from '../models/GapAnalysis.js';
import Recommendation from '../models/Recommendation.js';
import Bank from '../models/Bank.js';
import PDFDocument from 'pdfkit';
import { getQuestions } from '../data/questions.js';

const router = express.Router();

// Generate PDF report for an assessment
router.get('/assessment/:assessmentId/pdf', async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.assessmentId)
      .populate('bankId', 'name code email contactPerson');
    
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    const gapAnalysis = await GapAnalysis.findOne({ assessmentId: assessment._id });
    const recommendation = await Recommendation.findOne({ assessmentId: assessment._id });

    // Set response headers for PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=forensic-assessment-${assessment._id}.pdf`);

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    // Header
    doc.fontSize(20).text('Forensic Readiness Assessment Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(2);

    // Bank Information
    doc.fontSize(16).text('Bank Information', { underline: true });
    doc.fontSize(11);
    doc.text(`Bank Name: ${assessment.bankName}`);
    doc.text(`Bank Code: ${assessment.bankId?.code || 'N/A'}`);
    doc.text(`Contact Person: ${assessment.bankId?.contactPerson || 'N/A'}`);
    doc.text(`Assessment Date: ${new Date(assessment.assessmentDate).toLocaleDateString()}`);
    doc.moveDown();

    // Executive Summary
    doc.fontSize(16).text('Executive Summary', { underline: true });
    doc.fontSize(11);
    doc.text(`Overall Forensic Readiness Score: ${assessment.scores.overall.percentage}%`);
    doc.text(`Assessment Status: ${assessment.status.toUpperCase()}`);
    doc.moveDown();

    // Component Scores
    doc.fontSize(16).text('Component Scores', { underline: true });
    doc.fontSize(11);
    const components = [
      { name: 'Governance', score: assessment.scores.governance },
      { name: 'People', score: assessment.scores.people },
      { name: 'Processes', score: assessment.scores.processes },
      { name: 'Technology', score: assessment.scores.technology },
      { name: 'Data', score: assessment.scores.data },
      { name: 'Compliance', score: assessment.scores.compliance }
    ];

    components.forEach(comp => {
      doc.text(`${comp.name}: ${comp.score.percentage}% (${comp.score.score}/${comp.score.maxScore})`);
    });
    doc.moveDown();

    // Gap Analysis
    if (gapAnalysis) {
      doc.addPage();
      doc.fontSize(16).text('Gap Analysis', { underline: true });
      doc.fontSize(11);
      doc.text(`Total Gaps Identified: ${gapAnalysis.summary.totalGaps}`);
      doc.text(`Critical Gaps: ${gapAnalysis.summary.criticalGaps}`);
      doc.text(`High Priority Gaps: ${gapAnalysis.summary.highPriorityGaps}`);
      doc.text(`Medium Priority Gaps: ${gapAnalysis.summary.mediumPriorityGaps}`);
      doc.text(`Low Priority Gaps: ${gapAnalysis.summary.lowPriorityGaps}`);
      doc.moveDown();

      // Top gaps
      doc.fontSize(14).text('Top Priority Gaps', { underline: true });
      doc.fontSize(10);
      const topGaps = gapAnalysis.gaps.slice(0, 10);
      topGaps.forEach((gap, index) => {
        doc.text(`${index + 1}. ${gap.description}`);
        doc.text(`   Priority: ${gap.priority.toUpperCase()} | Gap: ${gap.gap} points`);
        doc.moveDown(0.5);
      });
    }

    // Recommendations
    if (recommendation) {
      doc.addPage();
      doc.fontSize(16).text('Recommendations & Action Plan', { underline: true });
      doc.fontSize(11);
      doc.text(`Total Recommendations: ${recommendation.actionPlan.length}`);
      doc.moveDown();

      // Group by priority
      const byPriority = {
        critical: recommendation.actionPlan.filter(a => a.priority === 'critical'),
        high: recommendation.actionPlan.filter(a => a.priority === 'high'),
        medium: recommendation.actionPlan.filter(a => a.priority === 'medium'),
        low: recommendation.actionPlan.filter(a => a.priority === 'low')
      };

      ['critical', 'high', 'medium', 'low'].forEach(priority => {
        if (byPriority[priority].length > 0) {
          doc.fontSize(14).text(`${priority.toUpperCase()} Priority Actions`, { underline: true });
          doc.fontSize(10);
          byPriority[priority].slice(0, 5).forEach((action, index) => {
            doc.text(`${index + 1}. ${action.title}`);
            doc.text(`   ${action.description.substring(0, 150)}...`);
            doc.text(`   Estimated Timeframe: ${action.estimatedTimeframe}`);
            doc.moveDown(0.5);
          });
          doc.moveDown();
        }
      });
    }

    // Footer
    doc.fontSize(8).text(
      'This report is confidential and intended for internal use only.',
      { align: 'center' }
    );

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get report data (JSON format)
router.get('/assessment/:assessmentId', async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.assessmentId)
      .populate('bankId', 'name code email contactPerson');
    
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    const gapAnalysis = await GapAnalysis.findOne({ assessmentId: assessment._id });
    const recommendation = await Recommendation.findOne({ assessmentId: assessment._id });

    res.json({
      success: true,
      data: {
        assessment,
        gapAnalysis,
        recommendation
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

