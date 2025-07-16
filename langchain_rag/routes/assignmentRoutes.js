import express from 'express';
import multer from 'multer';
import { extractTextFromPDF } from '../scripts/pdfUtils.js';
import { getEmbedding } from '../scripts/embeddingUtil.js';
import pineconeIndex from '../pineconeClient.js';
import OpenAI from 'openai';

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//Multer setup
const storage = multer.diskStorage({
  destination: 'data/assignments/',
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

router.post('/upload/assignment', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;

    //Extract student submission
    const studentText = await extractTextFromPDF(filePath);

    //Embed student text
    const studentEmbedding = await getEmbedding(studentText);

    //Query Pinecone for similar reference material
    const queryResponse = await pineconeIndex.query({
  vector: studentEmbedding,
  topK: 5,
  includeMetadata: true
});


    const matchedChunks = queryResponse.matches.map(m => m.metadata.text).join('\n\n');

    //Send to LLM (OpenAI) for comparison
    const prompt = `
You are an educational assistant that is supposed to mimic a professor in college. Avoid using any em dashes and avoid placeholders such as [your name].

A student has submitted the following response:

"${studentText}"

You also have access to the following reference material from the course:

"${matchedChunks}"

Please provide feedback on the student's response. Mention:
- If the response aligns with the reference material
- Any important ideas that were missed
- Suggestions for improvement

Talk to the student as if it were a direct message from you. It should be a cohesive message in paragraph / sentence form.
`;

    const feedbackRes = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a helpful academic assistant.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    });

    const feedback = feedbackRes.choices[0].message.content;

    res.status(200).json({
      message: '✅ Assignment analyzed with OpenAI',
      feedback
    });
  } catch (err) {
    console.error('Error analyzing assignment:', err);
    res.status(500).json({ error: 'Failed to analyze assignment with OpenAI' });
  }
});

export default router;
