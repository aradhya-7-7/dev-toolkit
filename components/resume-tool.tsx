import React, { useState, useRef } from "react";
import { marked } from "marked";

// Initialize Google Gemini API
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyB7M1shEJhJ3RABHgGcvKCVyg85UYZMJbY";

const ResumeAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{
    suggestions: string;
    score: number;
    formatSuggestions: string;
    contentSuggestions: string;
    impactSuggestions: string;
    keywordSuggestions: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("format");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

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
      const extractedText = await extractTextFromFile(file);
      setFileContent(extractedText);

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

Format your response as plain text in the following structure:
SCORE: [number between 1-100]

OVERALL SUGGESTIONS:
[Your overall feedback and suggestions]

FORMAT AND PRESENTATION:
[Your specific suggestions for improving format and presentation]

CONTENT AND CLARITY:
[Your specific suggestions for improving content and clarity]

IMPACT STATEMENTS:
[Your specific suggestions for improving impact statements and achievements]

KEYWORDS AND ATS:
[Your specific suggestions for improving keywords and ATS optimization]
`;

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
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;

      // Process the text response by parsing sections
      const scoreMatch = text.match(/SCORE:\s*(\d+)/i);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;

      // Extract sections using regex
      const overallMatch = text.match(/OVERALL SUGGESTIONS:([\s\S]*?)(?=FORMAT AND PRESENTATION:|$)/i);
      const formatMatch = text.match(/FORMAT AND PRESENTATION:([\s\S]*?)(?=CONTENT AND CLARITY:|$)/i);
      const contentMatch = text.match(/CONTENT AND CLARITY:([\s\S]*?)(?=IMPACT STATEMENTS:|$)/i);
      const impactMatch = text.match(/IMPACT STATEMENTS:([\s\S]*?)(?=KEYWORDS AND ATS:|$)/i);
      const keywordsMatch = text.match(/KEYWORDS AND ATS:([\s\S]*?)(?=$)/i);

      // Convert to HTML
      const suggestions = overallMatch ? await marked(overallMatch[1].trim()) : "No overall suggestions provided.";
      const formatSuggestions = formatMatch ? await marked(formatMatch[1].trim()) : "No format suggestions provided.";
      const contentSuggestions = contentMatch ? await marked(contentMatch[1].trim()) : "No content suggestions provided.";
      const impactSuggestions = impactMatch ? await marked(impactMatch[1].trim()) : "No impact statement suggestions provided.";
      const keywordSuggestions = keywordsMatch ? await marked(keywordsMatch[1].trim()) : "No keyword suggestions provided.";

      setResult({
        score,
        suggestions,
        formatSuggestions,
        contentSuggestions,
        impactSuggestions,
        keywordSuggestions
      });
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
    setActiveTab("format");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Determine score color class
  const getScoreColorClass = (score: number) => {
    if (score < 40) return "text-red-600";
    if (score < 70) return "text-yellow-600";
    return "text-green-600";
  };

  // Get progress bar color class
  const getProgressBarColorClass = (score: number) => {
    if (score < 40) return "bg-red-500";
    if (score < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-900">
      <h1 className="text-4xl text-white font-bold mb-8 text-center tracking-tight">
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
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="block w-full text-base text-gray-700
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-base file:font-medium
              file:bg-blue-100 file:text-blue-800
              hover:file:bg-blue-200 transition"
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600">Selected file: {file.name}</p>
          )}
        </div>
        <div className="flex space-x-4">
          <button
            onClick={analyzeResume}
            disabled={!file || loading}
            className={`px-5 py-2.5 rounded-lg text-white font-semibold text-base transition ${
              !file || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : "Analyze Resume"}
          </button>

          <button
            onClick={resetForm}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 font-medium transition"
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
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Score Card */}
          <div className="px-6 py-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Resume Score</h2>
            <div className="flex items-center mb-4">
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div
                  className={`h-6 rounded-full ${getProgressBarColorClass(result.score)} transition-all duration-500 ease-out`}
                  style={{ width: `${result.score}%` }}
                ></div>
              </div>
              <div className="ml-4">
                <span className={`font-bold text-2xl ${getScoreColorClass(result.score)}`}>
                  {result.score}
                </span>
                <span className="text-gray-500 text-sm ml-1">/ 100</span>
              </div>
            </div>
            
            <div className="p-4 bg-white border border-gray-200 rounded">
              <h3 className="font-bold text-gray-800 mb-2">Overall Assessment</h3>
              <div
                className="text-gray-700 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: result.suggestions }}
              />
            </div>
          </div>
          
          {/* Tabs + Content */}
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Improvement Recommendations
            </h2>
            
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab("format")}
                  className={`py-2 px-1 ${
                    activeTab === "format"
                      ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                      : "text-gray-500 hover:text-blue-500"
                  }`}
                >
                  Format & Presentation
                </button>
                <button
                  onClick={() => setActiveTab("content")}
                  className={`py-2 px-1 ${
                    activeTab === "content"
                      ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                      : "text-gray-500 hover:text-blue-500"
                  }`}
                >
                  Content & Clarity
                </button>
                <button
                  onClick={() => setActiveTab("impact")}
                  className={`py-2 px-1 ${
                    activeTab === "impact"
                      ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                      : "text-gray-500 hover:text-blue-500"
                  }`}
                >
                  Impact Statements
                </button>
                <button
                  onClick={() => setActiveTab("keywords")}
                  className={`py-2 px-1 ${
                    activeTab === "keywords"
                      ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                      : "text-gray-500 hover:text-blue-500"
                  }`}
                >
                  ATS Keywords
                </button>
              </nav>
            </div>
            
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              {activeTab === "format" && (
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: result.formatSuggestions }} />
                </div>
              )}
              
              {activeTab === "content" && (
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: result.contentSuggestions }} />
                </div>
              )}
              
              {activeTab === "impact" && (
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: result.impactSuggestions }} />
                </div>
              )}
              
              {activeTab === "keywords" && (
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: result.keywordSuggestions }} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;