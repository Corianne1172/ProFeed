//Express API for backend server
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import referenceRoutes from './routes/referenceRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/api', referenceRoutes);
app.use('/api', assignmentRoutes);

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'login.html'));
});

app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
