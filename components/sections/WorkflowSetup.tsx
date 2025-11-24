
import React, { useState } from 'react';
import { FormData, StageType, WorkflowStage } from '../../types';
import Button from '../ui/Button';

interface WorkflowSetupProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const typeOptions = [
    { type: StageType.APPOINTMENT_SCHEDULING, icon: '🗓️', placeholder: 'e.g., Video Interview, In-person Interview, Orientation' },
    { type: StageType.FORM_APPLICATION, icon: '📝', placeholder: 'e.g., Skills Assessment Form' },
    { type: StageType.ONBOARDING_FORMS, icon: '📑', placeholder: 'e.g., W-4, I-9, Direct Deposit' },
    { type: StageType.ID_CERTIFICATION, icon: '📄', placeholder: 'e.g., Driver\'s License, CNA License' },
    { type: StageType.OTHER, icon: '✨', placeholder: 'e.g., Background Check, Reference Check, Offer Letter' },
];

const WorkflowSetup: React.FC<WorkflowSetupProps> = ({ formData, setFormData }) => {
  const [newStageType, setNewStageType] = useState<StageType | null>(null);
  const [newStageName, setNewStageName] = useState('');

  const addStage = () => {
    if (!newStageType || newStageName.trim() === '') return;
    
    const newStage: WorkflowStage = {
      id: Date.now(),
      type: newStageType,
      name: newStageName.trim(),
    };

    setFormData(prev => ({ ...prev, workflow: [...prev?.workflow || [], newStage] }));
    setNewStageName('');
    setNewStageType(null);
  };

  const removeStage = (id: number) => {
    setFormData(prev => ({ ...prev, workflow: prev.workflow.filter(stage => stage.id !== id) }));
  };

  const currentPlaceholder = typeOptions.find(opt => opt.type === newStageType)?.placeholder || '';

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-slate-800">Hiring Workflow Setup</h2>
        <p className="text-slate-600 mt-2 text-lg">
          Build your company's hiring process after an applicant's initial screening.
        </p>
      </div>

      <div className="mb-8 p-6 bg-slate-50 rounded-lg border border-slate-200">
        <h3 className="font-bold text-slate-700 mb-4">Current Workflow</h3>
        <div className="relative pl-6">
            <div className="absolute top-0 left-[11px] w-0.5 h-full bg-slate-200"></div>
            
            <div className="relative mb-4 flex items-center">
                <div className="z-10 bg-slate-50 pr-2">
                    <div className="w-6 h-6 rounded-full bg-slate-600 text-white flex items-center justify-center text-sm">✓</div>
                </div>
                <span className="font-semibold text-slate-600 bg-slate-50 pl-2">Initial Screening</span>
            </div>
            
            {formData?.workflow?.map((stage, index) => (
                <div key={stage.id} className="relative mb-4 flex items-center group">
                     <div className="z-10 bg-slate-50 pr-2">
                        <div className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs">{index + 1}</div>
                    </div>
                    <div className="flex-grow bg-white p-3 rounded-md border border-slate-200">
                        <p className="font-semibold">{stage.name}</p>
                        <p className="text-xs text-slate-500">{stage.type}</p>
                    </div>
                    <button onClick={() => removeStage(stage.id)} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                    </button>
                </div>
            ))}

            <div className="relative flex items-center">
                <div className="z-10 bg-slate-50 pr-2">
                    <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
                    </div>
                </div>
                <span className="font-semibold text-green-600 bg-slate-50 pl-2">Hired</span>
            </div>
        </div>
      </div>
      
      <div className="pt-6 border-t border-slate-200">
        <h3 className="text-lg font-semibold text-slate-700">What is the next step in your hiring process?</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
            {typeOptions.map(option => (
                <button
                    key={option.type}
                    onClick={() => setNewStageType(option.type)}
                    className={`p-4 border-2 rounded-lg text-center transition ${newStageType === option.type ? 'border-brand-primary bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
                >
                    <span className="text-2xl" role="img" aria-label={option.type}>{option.icon}</span>
                    <p className="font-semibold mt-2 text-sm text-slate-700">{option.type}</p>
                </button>
            ))}
        </div>

        {newStageType && (
            <div className="mt-6 flex items-end gap-2 animate-fade-in">
              <div className="flex-grow">
                 <label htmlFor="stageName" className="block text-sm font-medium text-slate-700">Name this stage</label>
                 <input
                    id="stageName"
                    type="text"
                    value={newStageName}
                    onChange={(e) => setNewStageName(e.target.value)}
                    placeholder={currentPlaceholder}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                    autoFocus
                 />
              </div>
              <Button onClick={addStage} disabled={!newStageName.trim()} className="h-10">Add Step</Button>
            </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowSetup;