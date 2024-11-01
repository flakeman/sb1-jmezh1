import React from 'react';
import { Trash2, X } from 'lucide-react';
import { Document } from '../types';

interface DocumentListProps {
  documents: Document[];
  onDelete: (id: string) => void;
  onDeleteAll: () => void;
}

export function DocumentList({ documents, onDelete, onDeleteAll }: DocumentListProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Uploaded Documents</h2>
        {documents.length > 0 && (
          <button
            onClick={onDeleteAll}
            className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>
      <ul className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
        {documents.map((doc) => (
          <li key={doc.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
            <div>
              <p className="font-medium text-gray-900">{doc.name}</p>
              <p className="text-sm text-gray-500">{doc.uploadDate}</p>
            </div>
            <button
              onClick={() => onDelete(doc.id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Delete document"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </li>
        ))}
        {documents.length === 0 && (
          <li className="p-4 text-center text-gray-500">
            No documents uploaded yet
          </li>
        )}
      </ul>
      {documents.length > 0 && (
        <div className="p-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
          Total documents: {documents.length}
        </div>
      )}
    </div>
  );
}