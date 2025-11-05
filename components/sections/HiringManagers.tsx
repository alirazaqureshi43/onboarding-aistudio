
import React from 'react';
import { FormData, HiringManager, FileWithPreview } from '../../types';
import Input from '../ui/Input';
import FileUploader from '../ui/FileUploader';
import Tooltip from '../ui/Tooltip';
import Button from '../ui/Button';
import PhoneInput from '../ui/PhoneInput';

interface HiringManagersProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: { [index: number]: { [field: string]: string } };
}

const HiringManagers: React.FC<HiringManagersProps> = ({ formData, setFormData, errors }) => {
  const handleManagerChange = (index: number, field: keyof Omit<HiringManager, 'id' | 'file'>, value: string) => {
    const updatedManagers = formData.hiringManagers.map((manager, i) => 
        i === index ? { ...manager, [field]: value } : manager
    );
    setFormData(prev => ({ ...prev, hiringManagers: updatedManagers }));
  };

  const handleFileChange = (index: number, file: FileWithPreview | null) => {
    const updatedManagers = formData.hiringManagers.map((manager, i) => {
        if (i === index) {
            if (manager.file) URL.revokeObjectURL(manager.file.preview);
            return { ...manager, file: file || undefined };
        }
        return manager;
    });
    setFormData(prev => ({ ...prev, hiringManagers: updatedManagers }));
  };

  const addManager = () => {
    setFormData(prev => ({
      ...prev,
      hiringManagers: [
        ...prev.hiringManagers,
        { id: Date.now(), name: '', email: '', phone: '' }
      ]
    }));
  };

  const removeManager = (index: number) => {
    const managerToRemove = formData.hiringManagers[index];
    if (managerToRemove.file) {
        URL.revokeObjectURL(managerToRemove.file.preview);
    }
    const updatedManagers = formData.hiringManagers.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, hiringManagers: updatedManagers }));
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">User Details</h2>
        <p className="text-slate-500 mt-1">Provide contact information for people who will receive hiring/approval notifications.</p>
      </div>

      <div className="space-y-8">
        {formData.hiringManagers.map((manager, index) => (
          <div key={manager.id} className="p-6 border border-slate-200 rounded-lg relative">
            <h3 className="text-lg font-semibold text-slate-600 mb-4">{index === 0 ? 'Primary Admin User' : `Additional User ${index + 1}`}</h3>
            {formData.hiringManagers.length > 1 && (
              <button
                type="button"
                onClick={() => removeManager(index)}
                className="absolute top-4 right-4 text-slate-400 hover:text-red-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Name *" name={`name-${manager.id}`} value={manager.name} onChange={e => handleManagerChange(index, 'name', e.target.value)} error={errors?.[index]?.name} />
              <Input label="Email *" name={`email-${manager.id}`} type="email" value={manager.email} onChange={e => handleManagerChange(index, 'email', e.target.value)} error={errors?.[index]?.email} />
              <PhoneInput label="Phone Number *" name={`phone-${manager.id}`} value={manager.phone} onChange={value => handleManagerChange(index, 'phone', value)} error={errors?.[index]?.phone} />
              <div className="flex items-start gap-2">
                <FileUploader label={`Photo/ID Card - ${manager.id}`} file={manager.file} onFileSelect={file => handleFileChange(index, file)} maxSizeMB={10} />
                 <div className="pt-8"><Tooltip text="Optional: Upload a photo or company ID card." /></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Button onClick={addManager} variant="secondary" className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Additional User
        </Button>
      </div>
    </div>
  );
};

export default HiringManagers;
