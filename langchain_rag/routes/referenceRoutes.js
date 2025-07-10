import express from 'express';
import multer from 'multer';
import { extractTextFromPDF } from '../scripts/pdfUtils.js';
import { getEmbedding } from '../scripts/embeddingUtil.js';
import { chunkText } from '../scripts/chunkUtil.js';
import pineconeIndex from '../pineconeClient.js';

const router = express.Router();
const storage = multer.diskStorage({
  destination: 'data/reference/',
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

router.post('/upload/reference', upload.single('file'), async (req, res) => {
  try {
    const text = await extractTextFromPDF(req.file.path);
    const chunks = chunkText(text);

    const vectors = await Promise.all(chunks.map(async (chunk, i) => ({
      id: `${req.file.filename}-chunk-${i}`,
      values: await getEmbedding(chunk),
      metadata: { text: chunk, source: req.file.filename }
    })));

    await pineconeIndex.upsert(vectors);

    res.status(200).json({ message: 'Reference PDF succesfully indexed in Pinecone' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to index reference file' });
  }
});

export default router;