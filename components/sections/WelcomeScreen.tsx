
import React from 'react';
import Button from '../ui/Button';
import logo from '../../assets/engyj-logo.png'

interface WelcomeScreenProps {
  onNext: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg text-center animate-fade-in">
        <div className="max-w-md mx-auto">
            <img src={logo} alt="Welcome" className="rounded-lg mb-6" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">Welcome to your onboarding form.</h1>
        <p className="mt-4 text-lg text-slate-600">
            This interactive walkthrough will help you complete each section easily and accurately.
        </p>
        <div className="mt-8">
            <Button onClick={onNext} className="px-8 py-3 text-lg">
                Start Onboarding
            </Button>
        </div>
    </div>
  );
};

export default WelcomeScreen;
