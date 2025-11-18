import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Resource from '../models/Resource.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/forensic-readiness';

const resources = [
  {
    title: 'CBN Cybersecurity Framework',
    description: 'Central Bank of Nigeria Cybersecurity Framework for financial institutions',
    category: 'guideline',
    type: 'link',
    url: 'https://www.cbn.gov.ng/Out/2021/FPRD/CBN%20CYBERSECURITY%20FRAMEWORK%20FOR%20DEPOSIT%20MONEY%20BANKS.pdf',
    tags: ['CBN', 'cybersecurity', 'framework', 'regulation'],
    component: 'general',
    source: 'CBN'
  },
  {
    title: 'Digital Forensics Policy Template',
    description: 'Template for creating a comprehensive digital forensics policy',
    category: 'template',
    type: 'document',
    tags: ['policy', 'template', 'governance'],
    component: 'governance',
    source: 'CBN'
  },
  {
    title: 'Incident Response Plan Template',
    description: 'Standard template for incident response planning',
    category: 'template',
    type: 'document',
    tags: ['incident', 'response', 'template', 'processes'],
    component: 'processes',
    source: 'CBN'
  },
  {
    title: 'ISO 27037 Guidelines',
    description: 'ISO/IEC 27037:2012 Guidelines for identification, collection, acquisition and preservation of digital evidence',
    category: 'guideline',
    type: 'link',
    url: 'https://www.iso.org/standard/44381.html',
    tags: ['ISO', 'standard', 'evidence', 'processes'],
    component: 'processes',
    source: 'ISO'
  },
  {
    title: 'Forensic Investigator Training Program',
    description: 'Recommended training program for forensic investigators',
    category: 'best-practice',
    type: 'document',
    tags: ['training', 'people', 'skills'],
    component: 'people',
    source: 'CBN'
  },
  {
    title: 'Evidence Chain of Custody Form',
    description: 'Template form for maintaining chain of custody for digital evidence',
    category: 'template',
    type: 'document',
    tags: ['evidence', 'chain-of-custody', 'template', 'processes'],
    component: 'processes',
    source: 'CBN'
  },
  {
    title: 'Data Classification Policy Template',
    description: 'Template for creating data classification policies',
    category: 'template',
    type: 'document',
    tags: ['data', 'classification', 'policy', 'template'],
    component: 'data',
    source: 'CBN'
  },
  {
    title: 'NDPR Compliance Checklist',
    description: 'Nigeria Data Protection Regulation compliance checklist',
    category: 'regulation',
    type: 'document',
    tags: ['NDPR', 'compliance', 'data-protection', 'regulation'],
    component: 'compliance',
    source: 'NITDA'
  },
  {
    title: 'Forensic Tool Selection Guide',
    description: 'Guide for selecting appropriate digital forensics tools',
    category: 'best-practice',
    type: 'document',
    tags: ['tools', 'technology', 'selection'],
    component: 'technology',
    source: 'CBN'
  },
  {
    title: 'Log Management Best Practices',
    description: 'Best practices for log management and retention',
    category: 'best-practice',
    type: 'document',
    tags: ['logging', 'monitoring', 'technology'],
    component: 'technology',
    source: 'CBN'
  }
];

async function seedResources() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing resources
    await Resource.deleteMany({});
    console.log('🗑️  Cleared existing resources');

    // Insert new resources
    await Resource.insertMany(resources);
    console.log(`✅ Seeded ${resources.length} resources`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding resources:', error);
    process.exit(1);
  }
}

seedResources();

