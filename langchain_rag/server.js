//Express API for backend server
import express from 'express';
import cors from 'cors';
import path from 'path';
import referenceRoutes from './routes/referenceRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', referenceRoutes);
app.use('/api', assignmentRoutes);

const PORT = process.env.PORT || 3001;
app.use(express.static(path.join(process.cwd(), 'frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'frontend', 'login.html'));
});


app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
