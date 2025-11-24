
import React, { useState, useEffect } from 'react';
import { FormData, FormErrors, HiringManager, QuestionType } from './types';
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
import { useSearchParams } from "react-router-dom";
import ThankYou from './components/ThankYou';
import AuthGuard from './components/AuthGuard';

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

// Helper function to serialize formData for localStorage (handles File objects)
const serializeFormData = (data: FormData): string => {
  const serializable = { ...data };
  // Convert FileWithPreview to serializable format
  if (serializable.companyLogo) {
    const logo = serializable.companyLogo;
    serializable.companyLogo = {
      name: logo.name,
      size: logo.size,
      type: logo.type,
      preview: logo.preview, // This is now a base64 string
    } as any;
  }
  serializable?.hiringManagers?.forEach((hm: HiringManager) => {
    if (hm.file) {
      hm.file = {
        name: hm.file.name,
        size: hm.file.size,
        type: hm.file.type,
        preview: hm.file.preview,
      } as any;
    }
  });
  return JSON.stringify(serializable);
};

// Helper function to deserialize formData from localStorage
const deserializeFormData = (json: string): FormData => {
  const parsed = JSON.parse(json);
  // Reconstruct FileWithPreview from serialized data
  if (parsed.companyLogo && parsed.companyLogo.preview) {
    // Create a minimal File-like object with the preview
    // Note: We can't fully reconstruct the File object, but we can preserve the preview
    parsed.companyLogo = {
      name: parsed.companyLogo.name,
      size: parsed.companyLogo.size,
      type: parsed.companyLogo.type,
      preview: parsed.companyLogo.preview,
    } as any;
  }
  parsed?.hiringManagers?.forEach((hm: HiringManager) => {
    if (hm.file && hm.file.preview) {
      hm.file = {
        name: hm.file.name,
        size: hm.file.size,
        type: hm.file.type,
        preview: hm.file.preview,
      } as any;
    }
  });
  return parsed;
};

const API_URL = process.env.REACT_APP_API_ENDPOINT || 'http://localhost/api';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(localStorage.getItem('currentStep') ? parseInt(localStorage.getItem('currentStep')!) : 0);
  const [formData, setFormData] = useState<FormData>(localStorage.getItem('formData') ? deserializeFormData(localStorage.getItem('formData')!) : {
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
        { id: 3, question: 'Do you have a valid Driver\'s License?', type: QuestionType.YES_NO, isQualifying: false },
    ],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [id, setId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [searchParams] = useSearchParams();


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
    console.log(formData);
    localStorage.setItem('formData', serializeFormData(formData));
    localStorage.setItem('currentStep', currentStep.toString());
    if (validateStep(currentStep)) {
        setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    }
    if(currentStep === 0){
      return;
    }
    else {
      handleSubmit();
    }
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));
  const goToStep = (step: number) => setCurrentStep(step);

 // Convert camelCase to snake_case
const toSnakeCase = (str: string) =>
  str.replace(/([A-Z])/g, "_$1").toLowerCase();

// Recursively convert object or array keys to snake_case
const convertKeysToSnake = (value: any): any => {
  if (Array.isArray(value)) {
    return value.map((item) => convertKeysToSnake(item));
  } else if (value && typeof value === "object" && !(value instanceof File)) {
    return Object.keys(value).reduce((acc: any, key: string) => {
      const newKey = toSnakeCase(key);
      acc[newKey] = convertKeysToSnake(value[key]);
      return acc;
    }, {});
  }
  return value;
};

// Helper function to prepare form data for API submission
const prepareFormDataForAPI = (data: FormData) => {
  const apiData: any = { ...data };

  // Fix file references and strip File objects to JSON-safe structures
  if (apiData.companyLogo) {
    const { name, size, type, preview } = apiData.companyLogo;
    apiData.companyLogo = { name, size, type, preview };
  }

  if (apiData.hiringManagers) {
    apiData.hiringManagers = apiData.hiringManagers.map((hm: any) => {
      if (hm.file) {
        const { name, size, type, preview } = hm.file;
        return { ...hm, file: { name, size, type, preview } };
      }
      return hm;
    });
  }

  // Convert all keys to snake_case recursively
  return convertKeysToSnake(apiData);
};



  const handleSubmit = async () => {

    try {
      // Prepare data for API
      const apiData = prepareFormDataForAPI(formData);
      const onboardingId = searchParams.get("id");
      
      const url = `${API_URL}/onboarding/session/${onboardingId}/step`;

      // Submit to API
      const response = await fetch(url, {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // id: id,
          step: currentStep,
          finished: currentStep === STEPS.length - 1,
          data: apiData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to submit form' }));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Form submitted successfully:', result);

      // Clear localStorage and show success
      localStorage.removeItem('formData');
      localStorage.removeItem('currentStep');
      // setIsSubmitted(true);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setSubmitError(error.message || 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const getOnboardingById = async () => {
    try {
      const onboardingId = searchParams.get("id");  
      const response = await fetch(`${API_URL}/onboarding/session/${onboardingId}`);
      const res = await response.json();
      if(res.status){
        const safeData = {
          ...res.data,
          ...(res.data.companyLogo && { companyLogo: res.data.companyLogo }),
          ...(res.data.hiringManagers && { hiringManagers: res.data.hiringManagers }),
          ...(res.data.workflow && { workflow: res.data.workflow }),
          ...(res.data.interviewTimings && { interviewTimings: res.data.interviewTimings }),
          ...(res.data.credentials && { credentials: res.data.credentials }),
          ...(res.data.preScreenQuestions && { preScreenQuestions: res.data.preScreenQuestions }),
          ...(res.data.basicDetails && { basicDetails: res.data.basicDetails }),
        };
      
        setFormData(safeData);
        setCurrentStep(res.currentStep);
        setIsSubmitted(res.finished);
      }
    } catch (error: any) {
      console.error('Error fetching onboarding:', error.message);
    }
    finally {
      setIsLoading(false);
    }
  }

  

  useEffect(() => {
    const onboardingId = searchParams.get("id");
    if(onboardingId){
      console.log(onboardingId);
      setId(onboardingId);
      getOnboardingById();
    }
  }, [searchParams])

  const renderStep = () => {
    if(isSubmitted) {
        return (
         <ThankYou/>
        )
    }
    if(isLoading){
      return (
        <div className="text-center p-12 bg-white rounded-lg shadow-xl min-h-screen flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-primary mx-auto"></div>
          <h2 className="text-2xl font-bold text-slate-800 mt-4">Loading...</h2>
          <p className="text-slate-600 mt-2">Please wait while we load your information.</p>
        </div>
      )
    }

    if(isCompleted){
      return (
        <ThankYou/>
      )
    }

    if (isSubmitting) {
        return (
            <div className="text-center p-12 bg-white rounded-lg shadow-xl">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-primary mx-auto"></div>
                <h2 className="text-2xl font-bold text-slate-800 mt-4">Submitting Form...</h2>
                <p className="text-slate-600 mt-2">Please wait while we save your information.</p>
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
      case 8: return <ReviewSubmit formData={formData} goToStep={goToStep} handleSubmit={handleSubmit} isSubmitting={isSubmitting} submitError={submitError} />;
      default: return <WelcomeScreen onNext={nextStep} />;
    }
  };

  const showNavigation = currentStep > 0 && currentStep < STEPS.length - 1 && !isSubmitted;

  return (
    <AuthGuard setIsLoading={setIsLoading} >
    <div className="bg-brand-background min-h-screen font-sans text-slate-800 flex flex-col md:flex-row p-4 sm:p-6 lg:p-8 gap-12">
      <aside className="w-full md:w-72 flex-shrink-0">
        <ProgressBar steps={STEPS} currentStep={currentStep} />
      </aside>
      <main className="flex-1">
        <div className="w-full max-w-4xl">
          {renderStep()}
          {showNavigation && (
            <div className="mt-8 flex justify-between">
              <button onClick={prevStep} className="px-6 py-2 bg-white text-slate-700 rounded-md hover:bg-slate-100 font-semibold transition border border-slate-300 shadow-sm flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
              <button onClick={nextStep} className="px-6 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary-hover font-semibold transition shadow-sm flex items-center gap-2">
                Continue
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
    </AuthGuard>
  );
};

export default App;