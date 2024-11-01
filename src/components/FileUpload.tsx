import React, { useCallback } from 'react';
import { Upload, Loader2, FileText } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
  loading?: boolean;
}

export function FileUpload({ onFileUpload, loading = false }: FileUploadProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      if (files.length) onFileUpload(files);
    },
    [onFileUpload]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      if (files.length) onFileUpload(files);
    },
    [onFileUpload]
  );

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors cursor-pointer
          ${loading ? 'bg-gray-50' : 'hover:border-blue-500'}`}
      >
        <input
          type="file"
          onChange={handleFileInput}
          className="hidden"
          id="fileInput"
          accept=".doc,.docx,.pdf,.txt"
          multiple
          disabled={loading}
        />
        <label htmlFor="fileInput" className="cursor-pointer">
          {loading ? (
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
          ) : (
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          )}
          <p className="text-lg font-medium text-gray-700">
            {loading ? 'Analyzing documents...' : 'Drag and drop your documents here'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {loading ? 'Please wait...' : 'or click to select multiple files'}
          </p>
        </label>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-700">
          <FileText className="w-5 h-5" />
          <p className="text-sm font-medium">Supported file types:</p>
        </div>
        <ul className="mt-2 text-sm text-blue-600 grid grid-cols-2 gap-2">
          <li className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            Text files (.txt)
          </li>
          <li className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            Word documents (.doc, .docx)
          </li>
          <li className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            PDF files (.pdf)
          </li>
        </ul>
      </div>
    </div>
  );
}