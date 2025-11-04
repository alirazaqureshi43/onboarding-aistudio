import React, { useState } from 'react';
import { FormData, PreScreenQuestion, QuestionType } from '../../types';
import Button from '../ui/Button';

interface PreScreenQuestionsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const PreScreenQuestions: React.FC<PreScreenQuestionsProps> = ({ formData, setFormData }) => {
  const [newOptions, setNewOptions] = useState<{[key: number]: string}>({});

  const handleQuestionChange = (id: number, field: keyof PreScreenQuestion, value: string | QuestionType | boolean) => {
    const updatedQuestions = formData.preScreenQuestions.map((q) => {
      if (q.id === id) {
        const updatedQuestion = { ...q, [field]: value };
        // Reset dependent fields when question type changes
        if (field === 'type') {
            updatedQuestion.qualifyingAnswer = '';
            updatedQuestion.options = value === QuestionType.MULTIPLE_CHOICE ? [] : undefined;
        }
        // Unset qualifying answer if it's no longer a qualifying question
        if (field === 'isQualifying' && value === false) {
            updatedQuestion.qualifyingAnswer = '';
        }
        return updatedQuestion;
      }
      return q;
    });
    setFormData(prev => ({ ...prev, preScreenQuestions: updatedQuestions }));
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      preScreenQuestions: [
        ...prev.preScreenQuestions,
        { id: Date.now(), question: '', type: QuestionType.YES_NO, isQualifying: false }
      ]
    }));
  };

  const removeQuestion = (id: number) => {
    setFormData(prev => ({ ...prev, preScreenQuestions: prev.preScreenQuestions.filter((q) => q.id !== id) }));
  };

  const handleAddOption = (questionId: number) => {
    const newOption = newOptions[questionId]?.trim();
    if (!newOption) return;

    const updatedQuestions = formData.preScreenQuestions.map((q) => {
      if (q.id === questionId) {
        return { ...q, options: [...(q.options || []), newOption] };
      }
      return q;
    });

    setFormData(prev => ({ ...prev, preScreenQuestions: updatedQuestions }));
    setNewOptions(prev => ({...prev, [questionId]: ''}));
  };

  const handleRemoveOption = (questionId: number, optionIndex: number) => {
    const updatedQuestions = formData.preScreenQuestions.map((q) => {
      if (q.id === questionId) {
        const removedOption = q.options?.[optionIndex];
        const updatedOptions = (q.options || []).filter((_, oi) => oi !== optionIndex);
        const updatedQuestion = { ...q, options: updatedOptions };
        // If the removed option was the qualifying answer, reset it
        if(q.qualifyingAnswer === removedOption) {
            updatedQuestion.qualifyingAnswer = '';
        }
        return updatedQuestion;
      }
      return q;
    });
    setFormData(prev => ({ ...prev, preScreenQuestions: updatedQuestions }));
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Common Pre-Screen Questions</h2>
        <p className="text-slate-500 mt-1">These questions help filter candidates early. Mark questions as "qualifying" to automate screening.</p>
      </div>

      <div className="space-y-6">
        {formData.preScreenQuestions.map((q, index) => (
          <div key={q.id} className="p-4 border border-slate-200 rounded-lg relative">
            <button onClick={() => removeQuestion(q.id)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            </button>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-grow w-full">
                  <label className="text-sm font-medium text-slate-500">Question {index + 1}</label>
                  <input
                      type="text"
                      value={q.question}
                      onChange={(e) => handleQuestionChange(q.id, 'question', e.target.value)}
                      placeholder="e.g., Are you available on weekends?"
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
                  />
              </div>
              <div className="w-full md:w-56">
                  <label className="text-sm font-medium text-slate-500">Answer Type</label>
                  <select
                      value={q.type}
                      onChange={(e) => handleQuestionChange(q.id, 'type', e.target.value as QuestionType)}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm"
                  >
                      {Object.values(QuestionType).map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center">
                    <input type="checkbox" id={`qualifying-${q.id}`} checked={!!q.isQualifying} onChange={(e) => handleQuestionChange(q.id, 'isQualifying', e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                    <label htmlFor={`qualifying-${q.id}`} className="ml-2 block text-sm text-slate-900">Mark as a qualifying question</label>
                </div>
                
                {q.isQualifying && (
                    <div className="pl-6 animate-fade-in">
                        <label className="text-sm font-medium text-slate-700">Qualifying Answer</label>
                        {q.type === QuestionType.YES_NO && (
                             <select value={q.qualifyingAnswer || ''} onChange={(e) => handleQuestionChange(q.id, 'qualifyingAnswer', e.target.value)} className="mt-1 block w-full md:w-1/2 px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm">
                                <option value="">Select qualifying answer</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        )}
                        {(q.type === QuestionType.TEXT || q.type === QuestionType.NUMBER) && (
                            <input type={q.type === QuestionType.NUMBER ? 'number' : 'text'} value={q.qualifyingAnswer || ''} onChange={(e) => handleQuestionChange(q.id, 'qualifyingAnswer', e.target.value)} className="mt-1 block w-full md:w-1/2 px-3 py-2 border border-slate-300 rounded-md shadow-sm" placeholder="Enter the required answer" />
                        )}
                        {q.type === QuestionType.MULTIPLE_CHOICE && (
                            <select value={q.qualifyingAnswer || ''} onChange={(e) => handleQuestionChange(q.id, 'qualifyingAnswer', e.target.value)} className="mt-1 block w-full md:w-1/2 px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm">
                                <option value="">Select from options below</option>
                                {(q.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        )}
                    </div>
                )}
            </div>

            {q.type === QuestionType.MULTIPLE_CHOICE && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Custom Answer Options</h4>
                    <div className="space-y-2">
                        {(q.options || []).map((opt, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-md">
                                <span className="flex-grow text-sm text-slate-800 pl-2">{opt}</span>
                                <button onClick={() => handleRemoveOption(q.id, optIndex)} className="text-slate-400 hover:text-red-500 p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 11a1 1 0 112 0v1a1 1 0 11-2 0v-1zM11 11a1 1 0 100 2h1a1 1 0 100-2h-1z" clipRule="evenodd" /></svg></button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                        <input type="text" value={newOptions[q.id] || ''} onChange={e => setNewOptions(prev => ({...prev, [q.id]: e.target.value}))} onKeyDown={e => e.key === 'Enter' && handleAddOption(q.id)} placeholder="Add a new answer option" className="flex-grow block w-full px-3 py-1.5 border border-slate-300 rounded-md shadow-sm text-sm" />
                        <Button onClick={() => handleAddOption(q.id)} variant="secondary" className="text-sm py-1.5 px-3">Add</Button>
                    </div>
                </div>
            )}
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
