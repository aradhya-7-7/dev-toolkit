import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs/promises';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import path from 'path';

// Disable Next.js body parsing (we use formidable instead)
export const config = {
  api: {
    bodyParser: false,
  },
};

const readFileContent = async (file: File, mime: string) => {
  const buffer = await fs.readFile(file.filepath);

  if (mime === 'application/pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  } else if (
    mime ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } else {
    throw new Error('Unsupported file type');
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = formidable({
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    multiples: false,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Formidable error:', err);
      return res.status(500).json({ error: 'File parsing failed.' });
    }

    try {
      const fileField = files.file;
      const file = Array.isArray(fileField) ? fileField[0] : fileField;

      if (!file || !file.filepath || !file.mimetype) {
        return res.status(400).json({ error: 'Invalid or missing file.' });
      }

      const text = await readFileContent(file, file.mimetype);
      return res.status(200).json({ text });
    } catch (error: any) {
      console.error('Extraction error:', error.message);
      return res.status(500).json({ error: 'Failed to extract text from file.' });
    }
  });
};

export default handler;
