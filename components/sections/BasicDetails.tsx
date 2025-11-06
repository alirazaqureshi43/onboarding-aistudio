
import React from 'react';
import { FormData } from '../../types';
import Input from '../ui/Input';
import Tooltip from '../ui/Tooltip';
import SearchableDropdown from '../ui/SearchableDropdown';
import PhoneInput from '../ui/PhoneInput';

interface BasicDetailsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: { [key: string]: string };
}

const timezones = [
    { value: 'Pacific/Midway', label: 'Midway Island' },
    { value: 'Pacific/Honolulu', label: 'Hawaiian/Aleutian Time' },
    { value: 'America/Anchorage', label: 'Alaska Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' },
    { value: 'America/Phoenix', label: 'Mountain Standard Time' },
    { value: 'America/Denver', label: 'Mountain Daylight Time' },
    { value: 'America/Regina', label: 'Central Time (Saskatchewan)' },
    { value: 'America/Mexico_City', label: 'Central Time (Mexico City, Monterrey)' },
    { value: 'America/Chicago', label: 'Central Time' },
    { value: 'America/Indiana/Indianapolis', label: 'Eastern Time (Indiana)' },
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Port_of_Spain', label: 'Atlantic Time' },
    { value: 'Atlantic/Bermuda', label: 'Atlantic Time (Bermuda)' },
    { value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires' },
    { value: 'America/St_Johns', label: 'Newfoundland Time' },
    { value: 'America/Godthab', label: 'Western Greenland Time' },
    { value: 'Atlantic/South_Georgia', label: 'Central Greenland Time' },
    { value: 'America/Sao_Paulo', label: 'Eastern Brazil' },
    { value: 'Atlantic/Azores', label: 'Azores' },
    { value: 'GMT', label: 'Greenwich Mean Time' },
    { value: 'Europe/London', label: 'British Time (London)' },
    { value: 'Europe/Lisbon', label: 'Western European Time (Lisbon)' },
    { value: 'Europe/Dublin', label: 'Central European Time' },
    { value: 'Europe/Paris', label: 'Eastern European Time' },
    { value: 'Cairo', label: 'Cairo' },
    { value: 'Europe/Minsk', label: 'Minsk' },
    { value: 'Africa/Djibouti', label: 'Djibouti' },
    { value: 'Asia/Tehran', label: 'Tehran' },
    { value: 'Europe/Moscow', label: 'Moscow' },
    { value: 'Asia/Dubai', label: 'UAE (Dubai)' },
    { value: 'Asia/Tashkent', label: 'Uzbekistan (Tashkent)' },
    { value: 'Asia/Kabul', label: 'Afghanistan (Kabul)' },
    { value: 'Asia/Kolkata', label: 'India' },
    { value: 'Asia/Dhaka', label: 'Bangladesh (Dhaka)' },
    { value: 'Asia/Jakarta', label: 'Western Indonesian Time (Jakarta)' },
    { value: 'Asia/Bangkok', label: 'Thailand (Bangkok)' },
    { value: 'Asia/Hong_Kong', label: 'Hong Kong' },
    { value: 'Australia/Perth', label: 'Australian Western Time' },
    { value: 'Asia/Tokyo', label: 'Tokyo' },
    { value: 'Australia/Darwin', label: 'Australian Central Time (Northern Territory)' },
    { value: 'Australia/Adelaide', label: 'Australian Central Time (Adelaide)' },
    { value: 'Australia/Brisbane', label: 'Australian Eastern Time (Queensland)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (Sydney)' },
    { value: 'Pacific/Noumea', label: 'Noumea, New Caledonia' },
    { value: 'Pacific/Norfolk', label: 'Norfolk Island (Austl.)' },
    { value: 'Pacific/Auckland', label: 'New Zealand Time' },
    { value: 'Pacific/Tarawa', label: 'Tarawa' },
    { value: 'Kwajalein', label: 'International Date Line West' }
];

const usStates = [
  { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' }, { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' }, { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' }, { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' }, { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' }, { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' }, { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' }, { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' }, { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' }, { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' }, { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' }, { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' }, { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' }, { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' }, { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' }, { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' }, { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' }
];

const BasicDetails: React.FC<BasicDetailsProps> = ({ formData, setFormData, errors }) => {
  const handleChange = (field: keyof FormData['basicDetails'], value: string) => {
    setFormData(prev => ({
      ...prev,
      basicDetails: {
        ...prev.basicDetails,
        [field]: value,
      },
    }));
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-slate-800">Company's Basic Details</h2>
        <p className="text-slate-600 mt-2 text-lg">This information will be used to set up your company profile.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Company Name *"
          name="companyName"
          value={formData.basicDetails.companyName}
          onChange={e => handleChange('companyName', e.target.value)}
          error={errors.companyName}
          containerClassName="md:col-span-2"
        />
        <PhoneInput
          label="Phone Number *"
          name="phone"
          value={formData.basicDetails.phone}
          onChange={value => handleChange('phone', value)}
          error={errors.phone}
        />
        <Input
          label="Business Email *"
          name="businessEmail"
          type="email"
          value={formData.basicDetails.businessEmail}
          onChange={e => handleChange('businessEmail', e.target.value)}
          error={errors.businessEmail}
        />
        <Input
          label="Address 1 *"
          name="address1"
          value={formData.basicDetails.address1}
          onChange={e => handleChange('address1', e.target.value)}
          error={errors.address1}
          containerClassName="md:col-span-2"
        />
        <Input
          label="Address 2"
          name="address2"
          value={formData.basicDetails.address2}
          onChange={e => handleChange('address2', e.target.value)}
          error={errors.address2}
          containerClassName="md:col-span-2"
        />
        <Input
          label="Country *"
          name="country"
          value={formData.basicDetails.country}
          onChange={e => handleChange('country', e.target.value)}
          error={errors.country}
        />
        <Input
          label="City *"
          name="city"
          value={formData.basicDetails.city}
          onChange={e => handleChange('city', e.target.value)}
          error={errors.city}
        />
        <SearchableDropdown
          label="State *"
          options={usStates}
          value={formData.basicDetails.state}
          onChange={value => handleChange('state', value)}
          error={errors.state}
        />
        <Input
          label="Zip Code *"
          name="zip"
          value={formData.basicDetails.zip}
          onChange={e => handleChange('zip', e.target.value)}
          error={errors.zip}
        />
        <Input
          label="Office Hours *"
          name="officeHours"
          placeholder="e.g., 9:00 AM - 5:00 PM"
          value={formData.basicDetails.officeHours}
          onChange={e => handleChange('officeHours', e.target.value)}
          error={errors.officeHours}
        />
        <SearchableDropdown
          label="Time Zone *"
          options={timezones}
          value={formData.basicDetails.timeZone}
          onChange={value => handleChange('timeZone', value)}
          error={errors.timeZone}
        />
        <Input
          label="Website URL *"
          name="websiteUrl"
          type="url"
          placeholder="https://example.com"
          value={formData.basicDetails.websiteUrl}
          onChange={e => handleChange('websiteUrl', e.target.value)}
          error={errors.websiteUrl}
          containerClassName="md:col-span-2"
        />

        <div className="md:col-span-2 mt-4 pt-6 border-t border-slate-200">
          <h3 className="text-lg font-bold text-slate-700">Optional Company Details</h3>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700">Calendar</label>
          <select
            name="calendar"
            value={formData.basicDetails.calendar}
            onChange={e => handleChange('calendar', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Select Calendar</option>
            <option value="Google">Google</option>
            <option value="Outlook">Outlook</option>
          </select>
        </div>
        <Input
          label="Client Management Software"
          name="clientManagementSoftware"
          value={formData.basicDetails.clientManagementSoftware}
          onChange={e => handleChange('clientManagementSoftware', e.target.value)}
        />
        <Input
          label="Payroll Company"
          name="payrollCompany"
          value={formData.basicDetails.payrollCompany || ''}
          onChange={e => handleChange('payrollCompany', e.target.value)}
        />
        <Input
          label="Caregiver Training Provider"
          name="caregiverTraining"
          value={formData.basicDetails.caregiverTraining || ''}
          onChange={e => handleChange('caregiverTraining', e.target.value)}
        />

        <div className="md:col-span-2 mt-4 pt-6 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                Vendor Information
                <Tooltip text="Provide details for your marketing and website vendors if applicable." />
            </h3>
        </div>

        <Input label="SEO Company Name *" name="seoCompanyName" value={formData.basicDetails.seoCompanyName} onChange={e => handleChange('seoCompanyName', e.target.value)} error={errors.seoCompanyName} />
        <Input label="SEO Contact Name *" name="seoContactName" value={formData.basicDetails.seoContactName} onChange={e => handleChange('seoContactName', e.target.value)} error={errors.seoContactName} />
        <Input label="Website Company Name *" name="websiteCompanyName" value={formData.basicDetails.websiteCompanyName} onChange={e => handleChange('websiteCompanyName', e.target.value)} error={errors.websiteCompanyName} />
        <Input label="Website Contact Name *" name="websiteContactName" value={formData.basicDetails.websiteContactName} onChange={e => handleChange('websiteContactName', e.target.value)} error={errors.websiteContactName} />

      </div>
    </div>
  );
};

export default BasicDetails;