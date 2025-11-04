
import React from 'react';
import { FormData, FormErrors } from '../../types';
import Input from '../ui/Input';
import Tooltip from '../ui/Tooltip';

interface BasicDetailsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: { [key: string]: string };
}

const SectionHeader: React.FC<{title: string; subtitle: string}> = ({title, subtitle}) => (
    <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <p className="text-slate-500 mt-1">{subtitle}</p>
    </div>
);

const FieldWithTooltip: React.FC<{ children: React.ReactNode; tooltipText: string }> = ({ children, tooltipText }) => (
  <div className="flex items-start gap-2">
    <div className="flex-grow">{children}</div>
    <div className="pt-8">
      <Tooltip text={tooltipText} />
    </div>
  </div>
);

const BasicDetails: React.FC<BasicDetailsProps> = ({ formData, setFormData, errors }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, basicDetails: { ...prev.basicDetails, [name]: value } }));
  };

  const data = formData.basicDetails;

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <SectionHeader title="Basic Company Details" subtitle="Let's start with the basics. Please provide your company's information." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <FieldWithTooltip tooltipText="Use the full legal company name.">
          <Input label="Company Name *" name="companyName" value={data.companyName} onChange={handleChange} error={errors.companyName} required />
        </FieldWithTooltip>
        <FieldWithTooltip tooltipText="Include country code if required.">
          <Input label="Phone Number *" name="phone" value={data.phone} onChange={handleChange} error={errors.phone} required />
        </FieldWithTooltip>
        <Input label="Address 1" name="address1" value={data.address1} onChange={handleChange} containerClassName="md:col-span-2" />
        <Input label="Address 2" name="address2" value={data.address2} onChange={handleChange} containerClassName="md:col-span-2" />
        <Input label="Country" name="country" value={data.country} onChange={handleChange} />
        <Input label="City" name="city" value={data.city} onChange={handleChange} />
        <Input label="State" name="state" value={data.state} onChange={handleChange} />
        <Input label="Zip Code" name="zip" value={data.zip} onChange={handleChange} />
        <FieldWithTooltip tooltipText="e.g., 9am - 5pm, Mon-Fri">
          <Input label="Office Hours & Days *" name="officeHours" value={data.officeHours} onChange={handleChange} error={errors.officeHours} required />
        </FieldWithTooltip>
        <FieldWithTooltip tooltipText="Choose your main business operation zone so scheduling reflects correctly.">
          <Input label="Time Zone *" name="timeZone" value={data.timeZone} onChange={handleChange} error={errors.timeZone} required />
        </FieldWithTooltip>
        <FieldWithTooltip tooltipText="This email will be used for official communication.">
          <Input label="Personal Business email address *" name="businessEmail" type="email" value={data.businessEmail} onChange={handleChange} error={errors.businessEmail} containerClassName="md:col-span-2" required />
        </FieldWithTooltip>
        <FieldWithTooltip tooltipText="Ensure 'https://' prefix and correct domain.">
          <Input label="Website URL *" name="websiteUrl" type="url" value={data.websiteUrl} onChange={handleChange} error={errors.websiteUrl} containerClassName="md:col-span-2" required />
        </FieldWithTooltip>
        <div>
          <label className="block text-sm font-medium text-slate-700">Work Email Calendar</label>
          <select name="calendar" value={data.calendar} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <option value="">Select calendar</option>
            <option value="Google">Google</option>
            <option value="Outlook">Outlook</option>
          </select>
        </div>
        <Input label="Client Management Software (e.g., Wellsky, Axiscare)" name="clientManagementSoftware" value={data.clientManagementSoftware} onChange={handleChange} />
        <Input label="SEO/Adwords Company" name="seoCompany" value={data.seoCompany} onChange={handleChange} />
        <Input label="Website management Company & Contact" name="websiteCompany" value={data.websiteCompany} onChange={handleChange} />
      </div>
    </div>
  );
};

export default BasicDetails;
