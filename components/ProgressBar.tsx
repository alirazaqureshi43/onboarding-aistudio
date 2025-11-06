
import React from 'react';

interface ProgressBarProps {
  steps: string[];
  currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
    const progressPercentage = currentStep > 0 ? ((currentStep) / (steps.length -1)) * 100 : 0;
  return (
    <div className="sticky top-8">
        <h2 className="text-2xl font-bold text-slate-800">Onboarding Progress</h2>
        <p className="text-sm text-slate-500 mt-1 mb-8">Complete each step to get started</p>
        <nav>
            <ol>
            {steps.map((step, index) => {
                if (index === 0) return null; // Skip welcome step
                const stepNumber = index;
                const actualCurrentStep = currentStep;

                const isCompleted = stepNumber < actualCurrentStep;
                const isCurrent = stepNumber === actualCurrentStep;

                return (
                <li key={index} className="relative pb-10">
                    {index < steps.length - 1 && (
                    <div
                        className={`absolute top-4 left-4 -ml-px mt-0.5 h-full w-0.5 ${
                        isCompleted ? 'bg-brand-primary' : 'bg-slate-200'
                        }`}
                    />
                    )}
                    <div className={`relative flex items-center group transition-all duration-300 ${isCurrent ? 'bg-brand-primary text-white rounded-full py-2 px-4' : ''}`}>
                         <span className="h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 bg-white border-2 border-slate-200">
                            {isCompleted ? (
                                <span className="h-8 w-8 rounded-full flex items-center justify-center bg-brand-primary text-white border-2 border-brand-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            ) : (
                                <span className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold ${isCurrent ? 'bg-white text-brand-primary' : 'bg-slate-200 text-slate-500'}`}>
                                    {stepNumber}
                                </span>
                            )}
                        </span>
                        <span className={`ml-4 text-sm font-semibold ${isCurrent ? 'text-white' : isCompleted ? 'text-slate-600' : 'text-slate-500'}`}>
                            {step}
                        </span>
                    </div>
                </li>
                );
            })}
            </ol>
        </nav>
        <div className="mt-4 p-3 bg-slate-100 rounded-lg">
            <p className="text-xs font-semibold text-slate-600 mb-1">Step {currentStep} of {steps.length - 1}</p>
            <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div className="bg-brand-primary h-1.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
            </div>
        </div>
    </div>
  );
};

export default ProgressBar;