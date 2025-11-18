import express from 'express';
import Bank from '../models/Bank.js';

const router = express.Router();

// Get all banks
router.get('/', async (req, res) => {
  try {
    const banks = await Bank.find().sort({ createdAt: -1 });
    res.json({ success: true, data: banks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single bank
router.get('/:id', async (req, res) => {
  try {
    const bank = await Bank.findById(req.params.id);
    if (!bank) {
      return res.status(404).json({ success: false, message: 'Bank not found' });
    }
    res.json({ success: true, data: bank });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create bank
router.post('/', async (req, res) => {
  try {
    const bank = new Bank(req.body);
    await bank.save();
    res.status(201).json({ success: true, data: bank });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bank code or email already exists' 
      });
    }
    res.status(400).json({ success: false, message: error.message });
  }
});

// Update bank
router.put('/:id', async (req, res) => {
  try {
    const bank = await Bank.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!bank) {
      return res.status(404).json({ success: false, message: 'Bank not found' });
    }
    res.json({ success: true, data: bank });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Delete bank
router.delete('/:id', async (req, res) => {
  try {
    const bank = await Bank.findByIdAndDelete(req.params.id);
    if (!bank) {
      return res.status(404).json({ success: false, message: 'Bank not found' });
    }
    res.json({ success: true, message: 'Bank deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

