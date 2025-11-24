
import React from 'react';
import { FormData, StageType, InterviewTimingConfig } from '../../types';
import Button from '../ui/Button';

interface InterviewTimingsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];
const FREQUENCY_OPTIONS = [15, 30, 45, 60];


const InterviewTimings: React.FC<InterviewTimingsProps> = ({ formData, setFormData }) => {
  const interviewStages = formData.workflow.filter(stage => stage.type === StageType.APPOINTMENT_SCHEDULING);

  const getStageConfig = (stageId: number): InterviewTimingConfig => {
    return formData.interviewTimings[stageId] || {
      slotDuration: 30,
      slotFrequency: 15,
      appointmentType: 'Single',
      availability: {}
    };
  };

  const handleConfigChange = (stageId: number, field: keyof Omit<InterviewTimingConfig, 'availability'>, value: string | number) => {
    setFormData(prev => {
      const newTimings = { ...prev.interviewTimings };
      const currentConfig = getStageConfig(stageId);
      
      newTimings[stageId] = {
        ...currentConfig,
        [field]: typeof value === 'string' && field !== 'appointmentType' ? parseInt(value, 10) : value
      };
      
      return { ...prev, interviewTimings: newTimings };
    });
  };

  const handleDayToggle = (stageId: number, day: string) => {
    setFormData(prev => {
      const newTimings = JSON.parse(JSON.stringify(prev.interviewTimings || {}));
      
      if (!newTimings[stageId]) {
        newTimings[stageId] = {
          slotDuration: 30,
          slotFrequency: 15,
          appointmentType: 'Single',
          availability: {}
        };
      }

      if (!newTimings[stageId].availability) {
        newTimings[stageId].availability = {};
      }

      const availability = newTimings[stageId].availability;
      
      if (availability[day]) {
        delete availability[day];
      } else {
        availability[day] = [{ id: Date.now(), start: '09:00', end: '17:00' }];
      }
      
      return { ...prev, interviewTimings: newTimings };
    });
  };

  const addSlot = (stageId: number, day: string) => {
    setFormData(prev => {
        const newTimings = JSON.parse(JSON.stringify(prev.interviewTimings || {}));
        
        if (!newTimings[stageId]) {
          newTimings[stageId] = {
            slotDuration: 30,
            slotFrequency: 15,
            appointmentType: 'Single',
            availability: {}
          };
        }
        
        if (!newTimings[stageId].availability) {
          newTimings[stageId].availability = {};
        }
        
        const daySlots = newTimings[stageId].availability[day] || [];
        daySlots.push({ id: Date.now(), start: '', end: '' });
        newTimings[stageId].availability[day] = daySlots;
        return { ...prev, interviewTimings: newTimings };
    });
  };

  const updateSlot = (stageId: number, day: string, slotId: number, part: 'start' | 'end', value: string) => {
     setFormData(prev => {
        const newTimings = JSON.parse(JSON.stringify(prev.interviewTimings || {}));
        
        if (!newTimings[stageId]) {
          newTimings[stageId] = {
            slotDuration: 30,
            slotFrequency: 15,
            appointmentType: 'Single',
            availability: {}
          };
        }
        
        if (!newTimings[stageId].availability) {
          newTimings[stageId].availability = {};
        }
        
        if (!newTimings[stageId].availability[day]) {
          newTimings[stageId].availability[day] = [];
        }
        
        const daySlots = newTimings[stageId].availability[day].map((slot: any) => 
            slot.id === slotId ? { ...slot, [part]: value } : slot
        );
        newTimings[stageId].availability[day] = daySlots;
        return { ...prev, interviewTimings: newTimings };
    });
  };
  
  const removeSlot = (stageId: number, day: string, slotId: number) => {
    setFormData(prev => {
        const newTimings = JSON.parse(JSON.stringify(prev.interviewTimings || {}));
        
        if (!newTimings[stageId]) {
          newTimings[stageId] = {
            slotDuration: 30,
            slotFrequency: 15,
            appointmentType: 'Single',
            availability: {}
          };
        }
        
        if (!newTimings[stageId].availability || !newTimings[stageId].availability[day]) {
          return { ...prev, interviewTimings: newTimings };
        }
        
        let daySlots = newTimings[stageId].availability[day].filter((slot: any) => slot.id !== slotId);

        if (daySlots.length === 0) {
            delete newTimings[stageId].availability[day];
        } else {
            newTimings[stageId].availability[day] = daySlots;
        }
        
        return { ...prev, interviewTimings: newTimings };
    });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-slate-800">Appointment Availability</h2>
        <p className="text-slate-600 mt-2 text-lg">Set the available days and times for each appointment stage you created.</p>
      </div>

      {interviewStages.length === 0 ? (
        <div className="text-center py-10 px-6 bg-slate-50 rounded-lg">
            <h3 className="text-lg font-semibold text-slate-700">No Appointment Scheduling Stages Found</h3>
            <p className="text-slate-500 mt-2">You haven't added any "Appointment Scheduling" stages to your workflow yet. You can skip this step or go back to add one.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {interviewStages.map(stage => {
              const config = getStageConfig(stage.id);
              return (
              <div key={stage.id} className="p-6 border border-slate-200 rounded-lg">
                  <h3 className="text-lg font-bold text-slate-700">📅 {stage.name}</h3>

                  <div className="mt-4 p-4 bg-slate-50 rounded-md grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700">Slot Duration</label>
                          <select value={config.slotDuration} onChange={e => handleConfigChange(stage.id, 'slotDuration', e.target.value)} className="mt-1 block w-full text-sm border-slate-300 rounded-md shadow-sm">
                              {DURATION_OPTIONS.map(d => <option key={d} value={d}>{d} minutes</option>)}
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700">Slot Frequency</label>
                          <select value={config.slotFrequency} onChange={e => handleConfigChange(stage.id, 'slotFrequency', e.target.value)} className="mt-1 block w-full text-sm border-slate-300 rounded-md shadow-sm">
                              {FREQUENCY_OPTIONS.map(f => <option key={f} value={f}>Every {f} minutes</option>)}
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700">Appointments per Slot</label>
                          <div className="mt-2 flex gap-4">
                            <label className="flex items-center"><input type="radio" name={`appointmentType-${stage.id}`} value="Single" checked={config.appointmentType === 'Single'} onChange={e => handleConfigChange(stage.id, 'appointmentType', e.target.value)} className="h-4 w-4 text-brand-primary border-slate-300"/> <span className="ml-2 text-sm">Single</span></label>
                            <label className="flex items-center"><input type="radio" name={`appointmentType-${stage.id}`} value="Multiple" checked={config.appointmentType === 'Multiple'} onChange={e => handleConfigChange(stage.id, 'appointmentType', e.target.value)} className="h-4 w-4 text-brand-primary border-slate-300"/> <span className="ml-2 text-sm">Multiple</span></label>
                          </div>
                      </div>
                  </div>

                  <div className="mt-4 space-y-4">
                      {DAYS_OF_WEEK.map(day => {
                          const isDayActive = config.availability[day] !== undefined;
                          const slots = config.availability[day] || [];

                          return (
                              <div key={day}>
                                  <div className="flex items-center">
                                      <input
                                          type="checkbox"
                                          id={`${stage.id}-${day}`}
                                          checked={isDayActive}
                                          onChange={() => handleDayToggle(stage.id, day)}
                                          className="h-4 w-4 text-brand-primary border-slate-300 rounded focus:ring-brand-primary"
                                      />
                                      <label htmlFor={`${stage.id}-${day}`} className="ml-3 block text-sm font-medium text-slate-700">{day}</label>
                                  </div>
                                  {isDayActive && (
                                      <div className="pl-7 mt-2 space-y-2 animate-fade-in">
                                          {slots.map(slot => (
                                              <div key={slot.id} className="flex items-center gap-2">
                                                  <input type="time" value={slot.start} onChange={e => updateSlot(stage.id, day, slot.id, 'start', e.target.value)} className="w-full text-sm border-slate-300 rounded-md shadow-sm"/>
                                                  <span className="text-slate-500">-</span>
                                                  <input type="time" value={slot.end} onChange={e => updateSlot(stage.id, day, slot.id, 'end', e.target.value)} className="w-full text-sm border-slate-300 rounded-md shadow-sm"/>
                                                  <button onClick={() => removeSlot(stage.id, day, slot.id)} className="text-slate-400 hover:text-red-500 p-1">
                                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                  </button>
                                              </div>
                                          ))}
                                          <Button onClick={() => addSlot(stage.id, day)} variant="secondary" className="text-xs py-1 px-2">
                                              + Add slot / break
                                          </Button>
                                      </div>
                                  )}
                              </div>
                          )
                      })}
                  </div>
              </div>
          )})}
        </div>
      )}
    </div>
  );
};

export default InterviewTimings;