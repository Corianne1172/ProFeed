//Read & Load pdf files
import fs from 'fs/promises';
import pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';

export async function extractTextFromPDF(filePath) {
  const data = await fs.readFile(filePath);

  const loadingTask = pdfjsLib.getDocument({ data });
  const pdfDocument = await loadingTask.promise;

  let fullText = '';

  for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n\n';
  }

  return fullText;
}
