import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['guideline', 'template', 'best-practice', 'regulation', 'tool'],
    required: true
  },
  type: {
    type: String,
    enum: ['document', 'link', 'file'],
    required: true
  },
  url: {
    type: String
  },
  filePath: {
    type: String
  },
  tags: [{
    type: String
  }],
  component: {
    type: String,
    enum: ['governance', 'people', 'processes', 'technology', 'data', 'compliance', 'general']
  },
  source: {
    type: String,
    default: 'CBN'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
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

resourceSchema.index({ category: 1, component: 1 });
resourceSchema.index({ tags: 1 });

export default mongoose.model('Resource', resourceSchema);

