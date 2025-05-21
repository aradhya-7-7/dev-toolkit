import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

// Disable default bodyParser
export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err: any, _fields: any, files: formidable.Files) => {
    if (err) {
      return res.status(500).json({ error: 'File parsing failed.' });
    }

    const fileField = files.file;
    const file = Array.isArray(fileField) ? fileField[0] : fileField;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    const filePath = (file as formidable.File).filepath;
    const mime = (file as formidable.File).mimetype;

    try {
      let text = '';

      if (mime === 'application/pdf') {
        const buffer = fs.readFileSync(filePath);
        const data = await pdfParse(buffer);
        text = data.text;
      } else if (
        mime ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        const buffer = fs.readFileSync(filePath);
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
      } else {
        return res.status(400).json({ error: 'Unsupported file type.' });
      }

      res.status(200).json({ text });
    } catch (error) {
      res.status(500).json({ error: 'Failed to extract text from file.' });
    }
  });
};

export default handler;
