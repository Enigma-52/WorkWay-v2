import React, { useState } from "react";
import {
  Upload,
  FileText,
  Tag,
  X,
  AlertCircle,
  Check,
  Loader2,
} from "lucide-react";

const ResumePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  // Function to extract text from different file types
  const extractTextFromFile = async (file: File): Promise<string> => {
    try {
      if (file.type === "application/pdf") {
        // For PDFs, we'd use pdf.js here in a real implementation
        throw new Error("PDF parsing not implemented in this demo");
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        // For DOCX, we'd use mammoth.js in a real implementation
        throw new Error("DOCX parsing not implemented in this demo");
      } else if (file.type === "text/plain") {
        const text = await file.text();
        return text;
      } else {
        throw new Error("Unsupported file type");
      }
    } catch (err) {
      throw new Error(`Failed to extract text: ${err}`);
    }
  };

  // Function to extract keywords from text
  const extractKeywords = (text: string): string[] => {
    // In a real implementation, we'd use NLP libraries or AI services
    // This is a simple example looking for common tech keywords
    const commonKeywords = [
      "javascript",
      "python",
      "java",
      "react",
      "node",
      "sql",
      "aws",
      "docker",
      "kubernetes",
      "agile",
      "scrum",
      "ci/cd",
      "machine learning",
      "data science",
      "cloud",
      "devops",
      "frontend",
      "backend",
      "fullstack",
      "web development",
    ];

    const foundKeywords = new Set<string>();
    const lowerText = text.toLowerCase();

    commonKeywords.forEach((keyword) => {
      if (lowerText.includes(keyword.toLowerCase())) {
        foundKeywords.add(keyword);
      }
    });

    return Array.from(foundKeywords);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setIsUploading(true);
    setError("");
    setUploadSuccess(false);
    setKeywords([]);

    try {
      const text = await extractTextFromFile(uploadedFile);
      const extractedKeywords = extractKeywords(text);

      setKeywords(extractedKeywords);
      setUploadSuccess(true);
    } catch (err) {
    } finally {
      setIsUploading(false);
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter((k) => k !== keywordToRemove));
  };

  const clearUpload = () => {
    setFile(null);
    setKeywords([]);
    setUploadSuccess(false);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 text-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-100 mb-4">
            Resume Upload
          </h1>
          <p className="text-gray-400">
            Upload your resume to extract key skills and match with relevant
            jobs
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-gray-900/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8 mb-8">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-purple-500/20 border-dashed rounded-xl cursor-pointer hover:border-purple-500/40 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 mb-4 text-purple-400" />
                <p className="mb-2 text-xl text-purple-100">
                  {file ? file.name : "Drop your resume here"}
                </p>
                <p className="text-sm text-gray-400">
                  PDF, DOCX or TXT (max. 10MB)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>

        {/* Status and Results */}
        <div className="space-y-6">
          {/* Loading State */}
          {isUploading && (
            <div className="flex items-center justify-center space-x-3 text-purple-100">
              <Loader2 className="animate-spin" />
              <span>Analyzing resume...</span>
            </div>
          )}

          {/* Success State */}
          {uploadSuccess && (
            <div className="bg-gray-900/40 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <FileText className="text-purple-400" />
                  <h3 className="text-lg font-semibold text-purple-100">
                    Extracted Keywords
                  </h3>
                </div>
                <button
                  onClick={clearUpload}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Keywords Display */}
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-1 bg-purple-500/10 text-purple-300 px-3 py-1 rounded-full border border-purple-500/20"
                  >
                    <Tag size={14} />
                    <span>{keyword}</span>
                    <button
                      onClick={() => removeKeyword(keyword)}
                      className="hover:text-purple-100 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Save Button */}
              <button className="mt-6 w-full bg-purple-600 hover:bg-purple-500 text-white py-2 px-4 rounded-full transition-all duration-300 flex items-center justify-center space-x-2">
                <Check size={20} />
                <span>Save Keywords</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
