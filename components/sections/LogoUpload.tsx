
import React from 'react';
import { FormData, FileWithPreview } from '../../types';
import FileUploader from '../ui/FileUploader';

interface LogoUploadProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const LogoUpload: React.FC<LogoUploadProps> = ({ formData, setFormData }) => {
  const handleFileSelect = (file: FileWithPreview | null) => {
    setFormData(prev => ({ ...prev, companyLogo: file || undefined }));
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">High-Resolution Company Logo</h2>
        <p className="text-slate-500 mt-1">Upload your company logo. This will be used on job postings and communications.</p>
        <p className="text-sm text-slate-500 mt-2">Recommended: PNG with a transparent background, at least 300dpi.</p>
      </div>
      
      <FileUploader
        label="Company Logo"
        file={formData.companyLogo}
        onFileSelect={handleFileSelect}
        accept="image/png, image/jpeg"
        maxSizeMB={10}
      />
    </div>
  );
};

export default LogoUpload;
