import React, { useState, useRef } from "react";

// Initialize Google Gemini API
// Note: In a production app, you should store API keys securely
const API_KEY =
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  "AIzaSyB7M1shEJhJ3RABHgGcvKCVyg85UYZMJbY";

const ResumeAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{
    suggestions: string;
    score: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    // Check if file is PDF or Word
    const fileType = selectedFile.type;
    if (
      fileType !== "application/pdf" &&
      fileType !==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
      fileType !== "application/msword"
    ) {
      setError("Please upload a PDF or Word document");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setFile(selectedFile);
    setError(null);
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          // In a real application, you would use a library to extract text from PDFs and Word docs
          // For this example, we'll simulate text extraction
          // You could use libraries like pdf.js for PDFs and mammoth for Word docs

          // This is a placeholder - in a real app you'd extract actual text
          const text = `This is the extracted content from ${file.name}.
           In a real application, you would use proper libraries to extract text from
           PDF and Word documents. For PDFs, you might use pdf.js, and for Word documents,
           you might use mammoth.js.`;

          resolve(text);
        } catch (error) {
          reject("Failed to extract text from file");
        }
      };

      reader.onerror = () => reject("Error reading file");
      reader.readAsArrayBuffer(file);
    });
  };

  const analyzeResume = async () => {
    if (!file) {
      setError("Please upload a resume first");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Extract text from the uploaded file
      const extractedText = await extractTextFromFile(file);
      setFileContent(extractedText);

      // Prepare prompt for Gemini
      const prompt = `
        I'm going to provide you with a resume. Please analyze it and provide:
        1. A score between 1 and 100 based on its quality, clarity, and effectiveness
        2. Specific suggestions for improvement in these areas:
           - Format and presentation
           - Content and clarity
           - Impact statements and achievements
           - Keywords and ATS optimization
        
        Here's the resume content:
        ${extractedText}
        
        Format your response as JSON with two fields:
        - "score": a number between 1 and 100
        - "suggestions": detailed improvement recommendations
      `;

      // Using the direct REST API instead of the client library
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      // Extract the text from the response
      const text = data.candidates[0].content.parts[0].text;

      // Parse the JSON response
      try {
        const parsedResponse = JSON.parse(text);
        setResult({
          score: parsedResponse.score,
          suggestions: parsedResponse.suggestions,
        });
      } catch (e) {
        // If JSON parsing fails, use the raw text
        setResult({
          score: 50, // Default score
          suggestions: text,
        });
      }
    } catch (err) {
      setError(
        "Failed to analyze resume: " +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setFileContent(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center tracking-tight">
        Resume Analyzer
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="mb-6">
          <label className="block text-gray-800 text-base font-semibold mb-3">
            Upload your resume (PDF or Word)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            className="block w-full text-base text-gray-700 dark:text-gray-300
  file:mr-4 file:py-2 file:px-4
  file:rounded-md file:border-0
  file:text-base file:font-medium
  file:bg-blue-100 file:text-blue-800 dark:file:bg-blue-900 dark:file:text-blue-100
  hover:file:bg-blue-200 dark:hover:file:bg-blue-800 transition"
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected file: {file.name}
            </p>
          )}
        </div>
        <div className="flex space-x-4">
          <button
            onClick={analyzeResume}
            disabled={!file || loading}
            className={`px-5 py-2.5 rounded-lg text-white font-semibold text-base transition ${
              !file || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}     
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>

          <button
            onClick={resetForm}
            className="px-4 py-2 bg-yellow-200 hover:bg-yellow-300 rounded-md text-gray-800 font-medium"
          >
            Reset
          </button>
        </div>
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
      {result && (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Resume Score</h2>
            <div className="flex items-center">
              <div className="w-full bg-yellow-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${
                    result.score < 40
                      ? "bg-red-500"
                      : result.score < 70
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${result.score}%` }}
                ></div>
              </div>
              <span className="ml-4 font-bold text-xl">{result.score}/100</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Improvement Suggestions</h2>
            <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap bg-gray-100 dark:bg-gray-900 p-5 rounded-md text-base leading-relaxed font-mono">
                {result.suggestions}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
