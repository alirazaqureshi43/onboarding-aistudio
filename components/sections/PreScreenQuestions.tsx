
import React from 'react';
import { FormData, PreScreenQuestion, QuestionType } from '../../types';
import Button from '../ui/Button';

interface PreScreenQuestionsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const PreScreenQuestions: React.FC<PreScreenQuestionsProps> = ({ formData, setFormData }) => {
  const handleQuestionChange = (index: number, field: keyof PreScreenQuestion, value: string | QuestionType) => {
    const updatedQuestions = [...formData.preScreenQuestions];
    (updatedQuestions[index] as any)[field] = value;
    setFormData(prev => ({ ...prev, preScreenQuestions: updatedQuestions }));
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      preScreenQuestions: [
        ...prev.preScreenQuestions,
        { id: Date.now(), question: '', type: QuestionType.YES_NO }
      ]
    }));
  };

  const removeQuestion = (index: number) => {
    setFormData(prev => ({ ...prev, preScreenQuestions: prev.preScreenQuestions.filter((_, i) => i !== index) }));
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Common Pre-Screen Questions</h2>
        <p className="text-slate-500 mt-1">These questions help filter candidates early in the process. Create clear questions with appropriate response types.</p>
      </div>

      <div className="space-y-4">
        {formData.preScreenQuestions.map((q, index) => (
          <div key={q.id} className="flex flex-col md:flex-row items-start md:items-center gap-2 p-4 border border-slate-200 rounded-md">
            <div className="flex-grow w-full">
                <label className="text-sm font-medium text-slate-500">Question {index + 1}</label>
                <input
                    type="text"
                    value={q.question}
                    onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                    placeholder="e.g., Are you available on weekends?"
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>
            <div className="w-full md:w-48">
                <label className="text-sm font-medium text-slate-500">Answer Type</label>
                <select
                    value={q.type}
                    onChange={(e) => handleQuestionChange(index, 'type', e.target.value as QuestionType)}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                    {Object.values(QuestionType).map(type => <option key={type} value={type}>{type}</option>)}
                </select>
            </div>
            <div className="self-center md:self-end h-full">
                 <button onClick={() => removeQuestion(index)} className="mt-6 md:mt-0 p-2 text-slate-400 hover:text-red-500 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Button onClick={addQuestion} variant="secondary" className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Additional Question
        </Button>
      </div>
    </div>
  );
};

export default PreScreenQuestions;
