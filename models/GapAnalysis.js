import mongoose from 'mongoose';

const gapItemSchema = new mongoose.Schema({
  component: {
    type: String,
    required: true,
    enum: ['governance', 'people', 'processes', 'technology', 'data', 'compliance']
  },
  questionId: {
    type: String,
    required: true
  },
  currentScore: {
    type: Number,
    required: true
  },
  targetScore: {
    type: Number,
    default: 5
  },
  gap: {
    type: Number,
    required: true
  },
  priority: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const gapAnalysisSchema = new mongoose.Schema({
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  bankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bank',
    required: true
  },
  gaps: [gapItemSchema],
  summary: {
    totalGaps: { type: Number, default: 0 },
    criticalGaps: { type: Number, default: 0 },
    highPriorityGaps: { type: Number, default: 0 },
    mediumPriorityGaps: { type: Number, default: 0 },
    lowPriorityGaps: { type: Number, default: 0 }
  },
  componentGaps: {
    governance: { type: Number, default: 0 },
    people: { type: Number, default: 0 },
    processes: { type: Number, default: 0 },
    technology: { type: Number, default: 0 },
    data: { type: Number, default: 0 },
    compliance: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

gapAnalysisSchema.index({ assessmentId: 1 });
gapAnalysisSchema.index({ bankId: 1 });

export default mongoose.model('GapAnalysis', gapAnalysisSchema);

