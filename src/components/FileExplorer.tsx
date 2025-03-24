
import React, { useState, useEffect } from 'react';
import { File, Loader2 } from 'lucide-react';
import { File as FileType } from '@/types';
import { cn } from '@/lib/utils';
import { apiService } from '@/services/api';
import FileUploader from './FileUploader';

interface FileExplorerProps {
  onFileSelect: (file: FileType) => void;
  selectedFileId?: string;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onFileSelect, selectedFileId }) => {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);
  
  const loadFiles = async () => {
    try {
      setLoading(true);
      const data = await apiService.getFiles();
      setFiles(data);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadFiles();
  }, []);
  
  const handleFileRefresh = () => {
    loadFiles();
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold mb-4">File Explorer</h2>
      
      <FileUploader onUploadComplete={handleFileRefresh} />
      
      <div className="space-y-1.5 mt-6">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : files.length > 0 ? (
          files.map((file) => (
            <button
              key={file.id}
              className={cn(
                'file-item w-full text-left',
                selectedFileId === file.id ? 'active' : ''
              )}
              onClick={() => onFileSelect(file)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onFileSelect(file);
                  e.preventDefault();
                }
              }}
              tabIndex={0}
              role="option"
              aria-selected={selectedFileId === file.id}
            >
              <File size={18} className="mr-2 flex-shrink-0" />
              <span className="truncate flex-1">{file.name}</span>
            </button>
          ))
        ) : (
          <div className="text-sm text-gray-500 p-4 text-center">
            No files available. Upload a CSV file to begin.
          </div>
        )}
      </div>
    </div>
  );
};

export default FileExplorer;
