import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { DocumentList } from './components/DocumentList';
import { GraphVisualization } from './components/GraphVisualization';
import { Document, GraphNode, GraphLink } from './types';
import { ArrowRightCircle } from 'lucide-react';
import { parseDocumentContent, analyzeLevels } from './utils/documentParser';
import { buildGraphData } from './utils/graphBuilder';

function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleFileUpload = useCallback(async (files: File[]) => {
    try {
      setLoading(true);
      setProgress({ current: 0, total: files.length });

      const newDocs = await Promise.all(
        files.map(async (file, index) => {
          const content = await parseDocumentContent(file);
          const levels = analyzeLevels(content);
          setProgress(prev => ({ ...prev, current: index + 1 }));

          return {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            levels,
            uploadDate: new Date().toLocaleDateString()
          };
        })
      );

      setDocuments(prev => [...prev, ...newDocs]);
    } catch (error) {
      console.error('Error parsing documents:', error);
      alert('Error parsing documents. Please ensure all files are in the correct format.');
    } finally {
      setLoading(false);
      setProgress({ current: 0, total: 0 });
    }
  }, []);

  const handleDelete = useCallback((id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    setNodes([]);
    setLinks([]);
  }, []);

  const handleDeleteAll = useCallback(() => {
    setDocuments([]);
    setNodes([]);
    setLinks([]);
  }, []);

  const buildRelationships = useCallback(() => {
    const { nodes: newNodes, links: newLinks } = buildGraphData(documents);
    setNodes(newNodes);
    setLinks(newLinks);
  }, [documents]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Document Relationship Visualizer
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <FileUpload onFileUpload={handleFileUpload} loading={loading} />
            
            {loading && progress.total > 0 && (
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Processing documents...</span>
                  <span>{progress.current} / {progress.total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
            
            <DocumentList 
              documents={documents} 
              onDelete={handleDelete}
              onDeleteAll={handleDeleteAll}
            />
            
            <button
              onClick={buildRelationships}
              disabled={documents.length === 0 || loading}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowRightCircle className="w-5 h-5 mr-2" />
              Build Relationships
            </button>
          </div>
          
          <div className="lg:col-span-1">
            <GraphVisualization nodes={nodes} links={links} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;