export interface FileWithPreview extends File {
  preview: string;
}

export interface HiringManager {
  id: number;
  name: string;
  email: string;
  phone: string;
  file?: FileWithPreview;
}

export enum StageType {
  INTERVIEW = 'Interview',
  FORM = 'Form',
  CREDENTIALS = 'Credential Request',
  OTHER = 'Other',
}

export interface WorkflowStage {
  id: number;
  type: StageType;
  name: string;
}

export enum QuestionType {
  YES_NO = 'Yes/No',
  NUMBER = 'Number',
  TEXT = 'Text',
  MULTIPLE_CHOICE = 'Multiple Choice',
}

export interface PreScreenQuestion {
  id: number;
  question: string;
  type: QuestionType;
  isQualifying?: boolean;
  qualifyingAnswer?: string;
  options?: string[];
}

export interface TimeSlot {
  id: number;
  start: string;
  end: string;
}

export interface InterviewTimingConfig {
  slotDuration: number;
  slotFrequency: number;
  appointmentType: 'Single' | 'Multiple';
  availability: {
    [day: string]: TimeSlot[];
  };
}

export interface InterviewTimings {
  [stageId: number]: InterviewTimingConfig;
}


export interface FormData {
  basicDetails: {
    companyName: string;
    phone: string;
    address1: string;
    address2: string;
    country: string;
    city: string;
    state: string;
    zip: string;
    officeHours: string;
    timeZone: string;
    businessEmail: string;
    websiteUrl: string;
    calendar: 'Google' | 'Outlook' | '';
    clientManagementSoftware: string;
    seoCompany: string;
    websiteCompany: string;
  };
  hiringManagers: HiringManager[];
  companyLogo?: FileWithPreview;
  workflow: WorkflowStage[];
  interviewTimings: InterviewTimings;
  credentials: string[];
  preScreenQuestions: PreScreenQuestion[];
}

export type FormErrors = {
  [key in keyof FormData]?: {
    [field: string]: string;
  };
} & { hiringManagers?: { [index: number]: { [field: string]: string } } };