import mongoose from 'mongoose';

const actionItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  component: {
    type: String,
    required: true,
    enum: ['governance', 'people', 'processes', 'technology', 'data', 'compliance']
  },
  priority: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    required: true
  },
  estimatedEffort: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  estimatedTimeframe: {
    type: String
  },
  resources: [{
    type: String
  }],
  relatedGapId: {
    type: String
  }
});

const recommendationSchema = new mongoose.Schema({
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
  actionPlan: [actionItemSchema],
  status: {
    type: String,
    enum: ['draft', 'active', 'completed'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

recommendationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

recommendationSchema.index({ assessmentId: 1 });
recommendationSchema.index({ bankId: 1 });

export default mongoose.model('Recommendation', recommendationSchema);

