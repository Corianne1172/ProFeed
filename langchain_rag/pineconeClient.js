//Pinecone service used to store assignments and references
import pkg from '@pinecone-database/pinecone';
import dotenv from 'dotenv';

dotenv.config();


const pineconePkg = pkg.default ?? pkg;
const { Pinecone } = pineconePkg;


const apiKey = process.env.PINECONE_API_KEY?.trim();
const indexName = process.env.PINECONE_INDEX_NAME?.trim();

const hostUrl = process.env.PINECONE_HOST_URL?.trim();

if (!apiKey || !indexName || !hostUrl) {
  throw new Error('Missing or empty PINECONE_API_KEY, PINECONE_INDEX_NAME, or PINECONE_HOST_URL in .env');
}


const client = new Pinecone({ apiKey });

const index = client.Index(indexName, hostUrl);

export default index;