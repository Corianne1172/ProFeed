import express from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

import referenceRoutes from './routes/referenceRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import professorRoutes from './routes/professorRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('Mongo connection error:', err));

// Routes
app.use('/api', referenceRoutes);
app.use('/api', assignmentRoutes);
app.use('/api', professorRoutes);

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'login.html'));
});

app.use(express.static(path.join(__dirname, '../frontend')));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
