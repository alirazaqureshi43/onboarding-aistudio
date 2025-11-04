
import React from 'react';

interface ProgressBarProps {
  steps: string[];
  currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
        <h2 className="text-xl font-bold text-slate-700 mb-6">Onboarding Progress</h2>
        <nav>
            <ol>
            {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;

                return (
                <li key={index} className="relative pb-8">
                    {index < steps.length - 1 && (
                    <div
                        className={`absolute top-2 left-[10px] -ml-px mt-0.5 h-full w-0.5 ${
                        isCompleted ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                    />
                    )}
                    <div className="relative flex items-center group">
                        <span className="h-5 w-5 rounded-full flex items-center justify-center transition-all duration-300">
                            {isCompleted ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <span className={`h-5 w-5 rounded-full flex items-center justify-center ${isCurrent ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-slate-200'}`}>
                                    {!isCurrent && <span className="h-2 w-2 bg-slate-400 rounded-full"></span>}
                                </span>
                            )}
                        </span>
                        <span className={`ml-4 text-sm font-medium ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-slate-600' : 'text-slate-500'}`}>
                            {step}
                        </span>
                    </div>
                </li>
                );
            })}
            </ol>
        </nav>
    </div>
  );
};

export default ProgressBar;
