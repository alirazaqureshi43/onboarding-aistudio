
import React from 'react';
import { FormData } from '../../types';
import Button from '../ui/Button';

interface CredentialsListProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const CredentialsList: React.FC<CredentialsListProps> = ({ formData, setFormData }) => {
  const handleChange = (index: number, value: string) => {
    const updatedCredentials = [...formData?.credentials || []];
    updatedCredentials[index] = value;
    setFormData(prev => ({ ...prev, credentials: updatedCredentials }));
  };

  const addCredential = () => {
    setFormData(prev => ({ ...prev, credentials: [...prev?.credentials || [], ''] }));
  };

  const removeCredential = (index: number) => {
    setFormData(prev => ({ ...prev, credentials: prev?.credentials?.filter((_, i) => i !== index) || [] }));
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-slate-800">Required Credentials List</h2>
        <p className="text-slate-600 mt-2 text-lg">List the documents that caregivers must provide to prove their eligibility.</p>
      </div>

      <div className="space-y-4">
        {formData?.credentials?.map((credential, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={credential}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={`e.g., Driver's License`}
              className="flex-grow block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
            />
            <button onClick={() => removeCredential(index)} className="p-2 text-slate-400 hover:text-red-500 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Button onClick={addCredential} variant="secondary" className="flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Credential
        </Button>
      </div>
    </div>
  );
};

export default CredentialsList;