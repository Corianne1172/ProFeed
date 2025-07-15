import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getEmbedding(text) {
  const response = await openai.embeddings.create({
    input: text,
    model: 'text-embedding-3-large'
  });
  return response.data[0].embedding;
}
