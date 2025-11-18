import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true
  },
  component: {
    type: String,
    required: true,
    enum: ['governance', 'people', 'processes', 'technology', 'data', 'compliance']
  },
  answer: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  evidence: {
    type: String
  },
  notes: {
    type: String
  }
});

const assessmentSchema = new mongoose.Schema({
  bankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bank',
    required: true
  },
  bankName: {
    type: String,
    required: true
  },
  assessmentDate: {
    type: Date,
    default: Date.now
  },
  answers: [answerSchema],
  scores: {
    governance: {
      score: { type: Number, default: 0 },
      maxScore: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 }
    },
    people: {
      score: { type: Number, default: 0 },
      maxScore: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 }
    },
    processes: {
      score: { type: Number, default: 0 },
      maxScore: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 }
    },
    technology: {
      score: { type: Number, default: 0 },
      maxScore: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 }
    },
    data: {
      score: { type: Number, default: 0 },
      maxScore: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 }
    },
    compliance: {
      score: { type: Number, default: 0 },
      maxScore: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 }
    },
    overall: {
      score: { type: Number, default: 0 },
      maxScore: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 }
    }
  },
  status: {
    type: String,
    enum: ['draft', 'completed', 'submitted'],
    default: 'draft'
  },
  submittedAt: {
    type: Date
  },
  version: {
    type: Number,
    default: 1
  },
  previousAssessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment'
  }
}, {
  timestamps: true
});

// Index for efficient queries
assessmentSchema.index({ bankId: 1, assessmentDate: -1 });
assessmentSchema.index({ status: 1 });

export default mongoose.model('Assessment', assessmentSchema);

