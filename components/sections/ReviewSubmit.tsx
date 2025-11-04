import React from 'react';
import { FormData, TimeSlot, InterviewTimingConfig } from '../../types';
import Button from '../ui/Button';

interface ReviewSubmitProps {
  formData: FormData;
  goToStep: (step: number) => void;
  handleSubmit: () => void;
}

const ReviewItem: React.FC<{ label: string, value: string | undefined | null }> = ({ label, value }) => (
    value ? <div className="py-2"><dt className="font-medium text-slate-600">{label}</dt><dd className="mt-1 text-slate-900">{value}</dd></div> : null
);

const SectionReview: React.FC<{title: string, step: number, onEdit: (step:number) => void, children: React.ReactNode}> = ({title, step, onEdit, children}) => (
    <div className="bg-slate-50 p-4 sm:p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            <button onClick={() => onEdit(step)} className="text-sm font-semibold text-blue-600 hover:text-blue-800">Edit</button>
        </div>
        <div className="text-sm">{children}</div>
    </div>
)

const ReviewSubmit: React.FC<ReviewSubmitProps> = ({ formData, goToStep, handleSubmit }) => {
  const { basicDetails, hiringManagers, companyLogo, workflow, interviewTimings, credentials, preScreenQuestions } = formData;

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHour = h % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Review Your Answers</h2>
        <p className="text-slate-500 mt-1">Please review the information below before submitting. You can go back and edit any section.</p>
      </div>
      <div className="space-y-6">
        <SectionReview title="Basic Details" step={1} onEdit={goToStep}>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <ReviewItem label="Company Name" value={basicDetails.companyName} />
                <ReviewItem label="Phone Number" value={basicDetails.phone} />
                <ReviewItem label="Business Email" value={basicDetails.businessEmail} />
                <ReviewItem label="Website" value={basicDetails.websiteUrl} />
                <ReviewItem label="Address" value={`${basicDetails.address1}${basicDetails.address2 ? ', ' + basicDetails.address2 : ''}, ${basicDetails.city}, ${basicDetails.state} ${basicDetails.zip}, ${basicDetails.country}`} />
            </dl>
        </SectionReview>

        <SectionReview title="Hiring Managers" step={2} onEdit={goToStep}>
            {hiringManagers.map((hm, i) => (
                <div key={i} className="py-2 border-b border-slate-200 last:border-b-0">
                    <p className="font-semibold">{hm.name}</p>
                    <p className="text-slate-600">{hm.email} | {hm.phone}</p>
                </div>
            ))}
        </SectionReview>

        <SectionReview title="Company Logo" step={3} onEdit={goToStep}>
            {companyLogo && <img src={companyLogo.preview} alt="Company Logo" className="h-20 w-auto rounded-md bg-slate-100 p-1" />}
            {!companyLogo && <p className="text-slate-500">No logo uploaded.</p>}
        </SectionReview>

        <SectionReview title="Workflow Stages" step={4} onEdit={goToStep}>
            <ol className="list-decimal list-inside text-slate-900 space-y-2">
                {workflow.map(stage => (
                    <li key={stage.id}>
                       <span className="font-medium">{stage.name}</span> <span className="text-xs bg-slate-200 text-slate-600 font-semibold px-1.5 py-0.5 rounded">{stage.type}</span>
                    </li>
                ))}
            </ol>
            {workflow.length === 0 && <p className="text-slate-500">No workflow stages defined.</p>}
        </SectionReview>
        
        <SectionReview title="Interview Timings" step={5} onEdit={goToStep}>
            <div className="space-y-4">
            {Object.keys(interviewTimings).length > 0 ? (
                Object.entries(interviewTimings).map(([stageId, config]) => {
                    const stage = workflow.find(s => s.id === parseInt(stageId));
                    if (!stage || Object.keys(config.availability).length === 0) return null;
                    return (
                        <div key={stageId} className="pb-3 border-b border-slate-200 last:border-b-0">
                            <h4 className="font-semibold text-slate-700">{stage.name}</h4>
                            <div className="grid grid-cols-3 gap-2 text-xs mt-2 mb-2">
                                <div className="bg-white p-1 rounded border border-slate-200"><span className="font-medium text-slate-500">Duration:</span> {config.slotDuration} min</div>
                                <div className="bg-white p-1 rounded border border-slate-200"><span className="font-medium text-slate-500">Frequency:</span> {config.slotFrequency} min</div>
                                <div className="bg-white p-1 rounded border border-slate-200"><span className="font-medium text-slate-500">Appt. Type:</span> {config.appointmentType}</div>
                            </div>
                            <dl className="mt-1 space-y-1 pl-2">
                                {Object.entries(config.availability).map(([day, slots]) => (
                                    <div key={day} className="flex">
                                        <dt className="w-24 font-medium text-slate-500">{day}</dt>
                                        <dd className="text-slate-800">
                                            {/* FIX: Cast `slots` to `TimeSlot[]` as it was being inferred as `unknown`. */}
                                            {(slots as TimeSlot[]).map(s => `${formatTime(s.start)} - ${formatTime(s.end)}`).join(', ')}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    )
                })
            ) : <p className="text-slate-500">No interview timings configured.</p>}
            </div>
        </SectionReview>

        <SectionReview title="Credentials List" step={6} onEdit={goToStep}>
            <ul className="list-disc list-inside text-slate-600 space-y-1">
                {credentials.filter(c => c).map((c, i) => <li key={i}>{c}</li>)}
            </ul>
        </SectionReview>

        <SectionReview title="Pre-Screen Questions" step={7} onEdit={goToStep}>
             <ul className="list-decimal list-inside text-slate-600 space-y-1">
                {preScreenQuestions.filter(q => q.question).map(q => <li key={q.id}>{q.question} ({q.type})</li>)}
            </ul>
        </SectionReview>
      </div>
      <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end">
            <Button onClick={handleSubmit} className="px-8 py-3 text-lg">
                Submit Onboarding Form
            </Button>
      </div>
    </div>
  );
};

export default ReviewSubmit;