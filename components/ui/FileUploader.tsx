
import React, { useState } from 'react';
import { FileWithPreview } from '../../types';

interface FileUploaderProps {
  onFileSelect: (file: FileWithPreview | null) => void;
  accept?: string;
  maxSizeMB?: number;
  label: string;
  file: FileWithPreview | undefined;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, accept = "image/*", maxSizeMB = 10, label, file }) => {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
        onFileSelect(null);
        return;
    }

    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Max size is ${maxSizeMB}MB.`);
      onFileSelect(null);
      return;
    }
    setError(null);
    
    // Convert file to base64 data URL for localStorage compatibility
    const reader = new FileReader();
    reader.onloadend = () => {
      const fileWithPreview = Object.assign(selectedFile, {
        preview: reader.result as string,
      });
      onFileSelect(fileWithPreview);
    };
    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
      onFileSelect(null);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleReset = () => {
    onFileSelect(null);
    const input = document.getElementById(label) as HTMLInputElement;
    if(input) input.value = "";
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {file ? (
        <div className="mt-2 flex items-center gap-4 p-2 border border-slate-300 rounded-md bg-slate-50">
          {file?.type?.startsWith('image/') && (
            <img src={file?.preview} alt="Preview" className="h-16 w-16 object-cover rounded-md" />
          )}
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-800 truncate">{file?.name}</p>
            <p className="text-xs text-slate-500">{(file?.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button type="button" onClick={handleReset} className="text-red-600 hover:text-red-800 p-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-slate-600">
              <label htmlFor={label} className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Upload a file</span>
                <input id={label} name={label} type="file" className="sr-only" onChange={handleFileChange} accept={accept} />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-slate-500">PNG, JPG, GIF up to {maxSizeMB}MB</p>
          </div>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FileUploader;
