import express from 'express';
import Class from '../models/Class.js';

const router = express.Router();

// POST /api/professors/:profId/classes
router.post('/professors/:profId/classes', async (req, res) => {
  const { name, description } = req.body;
  const { profId } = req.params;

  try {
    const newClass = new Class({ name, description, professorId: profId });
    const saved = await newClass.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create class' });
  }
});

// GET /api/professors/:profId/classes
router.get('/professors/:profId/classes', async (req, res) => {
  try {
    const classes = await Class.find({ professorId: req.params.profId });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// DELETE /api/professors/:profId/classes/:classId
router.delete('/professors/:profId/classes/:classId', async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.classId);
    res.json({ message: 'Class deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete class' });
  }
});

export default router;
