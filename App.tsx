
import React, { useState } from 'react';
import { FormData, FormErrors, QuestionType, WorkflowStage } from './types';
import ProgressBar from './components/ProgressBar';
import WelcomeScreen from './components/sections/WelcomeScreen';
import BasicDetails from './components/sections/BasicDetails';
import HiringManagers from './components/sections/HiringManagers';
import LogoUpload from './components/sections/LogoUpload';
import WorkflowSetup from './components/sections/WorkflowSetup';
import CredentialsList from './components/sections/CredentialsList';
import PreScreenQuestions from './components/sections/PreScreenQuestions';
import ReviewSubmit from './components/sections/ReviewSubmit';
import InterviewTimings from './components/sections/InterviewTimings';

const STEPS = [
  "Welcome",
  "Basic Details",
  "User Details",
  "Company Logo",
  "Workflow Setup",
  "Interview Timings",
  "Credentials List",
  "Pre-Screen Questions",
  "Review & Submit",
];


const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    basicDetails: {
      companyName: '', phone: '', address1: '', address2: '', country: 'USA', city: '', state: '', zip: '',
      officeHours: '', timeZone: '', businessEmail: '', websiteUrl: '', calendar: '',
      clientManagementSoftware: '', seoCompanyName: '', seoContactName: '', websiteCompanyName: '', websiteContactName: '',
      payrollCompany: '', caregiverTraining: '',
    },
    hiringManagers: [{ id: 1, name: '', email: '', phone: '' }],
    workflow: [],
    interviewTimings: {},
    credentials: [
      'Driver License', 'Social Security Card', 'TB Result', 'Work Authorization', 
      'CHHA', 'CNA', 'HHA', 'Auto Insurance', 'CPR'
    ],
    preScreenQuestions: [
        { id: 1, question: 'Do you have experience as a caregiver?', type: QuestionType.YES_NO, isQualifying: false },
        { id: 2, question: 'How many years of experience?', type: QuestionType.NUMBER, isQualifying: false },
        { id: 3, question: 'Do you have a valid Driver’s License?', type: QuestionType.YES_NO, isQualifying: false },
    ],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (step === 1) { // Basic Details
        const details = formData.basicDetails;
        newErrors.basicDetails = {};
        if (!details.companyName) { newErrors.basicDetails.companyName = 'Company Name is required.'; isValid = false; }
        const phoneDigits = details.phone.replace(/\D/g, '');
        if (phoneDigits.length !== 10) { newErrors.basicDetails.phone = 'A valid 10-digit phone number is required.'; isValid = false; }
        if (!details.address1) { newErrors.basicDetails.address1 = 'Address 1 is required.'; isValid = false; }
        if (!details.country) { newErrors.basicDetails.country = 'Country is required.'; isValid = false; }
        if (!details.city) { newErrors.basicDetails.city = 'City is required.'; isValid = false; }
        if (!details.state) { newErrors.basicDetails.state = 'State is required.'; isValid = false; }
        if (!details.zip || !/^\d{5}$/.test(details.zip)) { newErrors.basicDetails.zip = 'A valid 5-digit Zip Code is required.'; isValid = false; }
        if (!details.officeHours) { newErrors.basicDetails.officeHours = 'Office Hours are required.'; isValid = false; }
        if (!details.timeZone) { newErrors.basicDetails.timeZone = 'Time Zone is required.'; isValid = false; }
        if (!details.businessEmail || !/\S+@\S+\.\S+/.test(details.businessEmail)) { newErrors.basicDetails.businessEmail = 'A valid email is required.'; isValid = false; }
        if (!details.websiteUrl) { newErrors.basicDetails.websiteUrl = 'Website URL is required.'; isValid = false; }
        if (!details.seoCompanyName) { newErrors.basicDetails.seoCompanyName = 'SEO Company Name is required.'; isValid = false; }
        if (!details.seoContactName) { newErrors.basicDetails.seoContactName = 'SEO Contact Name is required.'; isValid = false; }
        if (!details.websiteCompanyName) { newErrors.basicDetails.websiteCompanyName = 'Website Company Name is required.'; isValid = false; }
        if (!details.websiteContactName) { newErrors.basicDetails.websiteContactName = 'Website Contact Name is required.'; isValid = false; }
    }
    
    if (step === 2) { // Users
        newErrors.hiringManagers = {};
        formData.hiringManagers.forEach((hm, index) => {
            const hmErrors: {[key:string]: string} = {};
            if (!hm.name) { hmErrors.name = 'Name is required.'; isValid = false; }
            if (!hm.email || !/\S+@\S+\.\S+/.test(hm.email)) { hmErrors.email = 'A valid email is required.'; isValid = false; }
            const phoneDigits = hm.phone.replace(/\D/g, '');
            if (phoneDigits.length !== 10) { hmErrors.phone = 'A valid 10-digit phone number is required.'; isValid = false; }
            if (Object.keys(hmErrors).length > 0) newErrors.hiringManagers[index] = hmErrors;
        });
    }

    setErrors(newErrors);
    return isValid;
  };


  const nextStep = () => {
    if (validateStep(currentStep)) {
        setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));
  const goToStep = (step: number) => setCurrentStep(step);

  const handleSubmit = () => {
    // Final validation across all fields could go here
    setIsSubmitted(true);
  }

  const renderStep = () => {
    if(isSubmitted) {
        return (
            <div className="text-center p-12 bg-white rounded-lg shadow-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-3xl font-bold text-slate-800 mt-4">Form Submitted Successfully!</h2>
                <p className="text-slate-600 mt-2">Thank you for completing the onboarding process. We will be in touch shortly.</p>
            </div>
        )
    }

    switch (currentStep) {
      case 0: return <WelcomeScreen onNext={nextStep} />;
      case 1: return <BasicDetails formData={formData} setFormData={setFormData} errors={errors.basicDetails || {}} />;
      case 2: return <HiringManagers formData={formData} setFormData={setFormData} errors={errors.hiringManagers || {}} />;
      case 3: return <LogoUpload formData={formData} setFormData={setFormData} />;
      case 4: return <WorkflowSetup formData={formData} setFormData={setFormData} />;
      case 5: return <InterviewTimings formData={formData} setFormData={setFormData} />;
      case 6: return <CredentialsList formData={formData} setFormData={setFormData} />;
      case 7: return <PreScreenQuestions formData={formData} setFormData={setFormData} />;
      case 8: return <ReviewSubmit formData={formData} goToStep={goToStep} handleSubmit={handleSubmit} />;
      default: return <WelcomeScreen onNext={nextStep} />;
    }
  };

  const showNavigation = currentStep > 0 && currentStep < STEPS.length - 1 && !isSubmitted;

  return (
    <div className="min-h-screen font-sans text-slate-800 flex flex-col md:flex-row p-4 sm:p-6 lg:p-8 gap-6">
      <aside className="w-full md:w-1/4 lg:w-1/5">
        <ProgressBar steps={STEPS} currentStep={currentStep} />
      </aside>
      <main className="flex-1">
        <div className="w-full max-w-5xl mx-auto">
          {renderStep()}
          {showNavigation && (
            <div className="mt-8 flex justify-between">
              <button onClick={prevStep} className="px-6 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 font-semibold transition">Back</button>
              <button onClick={nextStep} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold transition">Next</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
