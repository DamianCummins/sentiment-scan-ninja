
import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { UploadProgress } from '@/types';
import { apiService } from '@/services/api';
import ProgressBar from './ProgressBar';

interface FileUploaderProps {
  onUploadComplete: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check if file is a CSV
    if (!file.name.endsWith('.csv')) {
      toast.error('Only CSV files are allowed');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    
    try {
      setUploading(true);
      
      // Simulate the generator with async iteration
      const uploadAsync = async function* () {
        yield* apiService.uploadFile(file);
      };
      
      // Process the progress updates
      for await (const progress of uploadAsync()) {
        setUploadProgress(progress);
        
        if (progress.isComplete) {
          setTimeout(() => {
            setUploading(false);
            setUploadProgress(null);
            onUploadComplete();
            if (fileInputRef.current) fileInputRef.current.value = '';
          }, 500);
        }
      }
    } catch (error) {
      toast.error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };
  
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".csv"
        className="hidden"
        aria-label="Upload CSV file"
        disabled={uploading}
      />
      
      <button
        className="upload-button"
        onClick={handleClick}
        disabled={uploading}
        aria-label="Upload CSV file"
      >
        <Upload size={18} />
        <span>Upload CSV</span>
      </button>
      
      {uploading && uploadProgress && (
        <div className="pt-2 animate-fade-in">
          <ProgressBar
            progress={uploadProgress.progress}
            total={uploadProgress.total}
            size="md"
            unit="B"
          />
        </div>
      )}
    </div>
  );
};

export default FileUploader;
