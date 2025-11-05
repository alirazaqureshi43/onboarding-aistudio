
import React from 'react';
import Input from './Input';

interface PhoneInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  name: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ label, value, onChange, error, name }) => {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '');
    const digits = input.substring(0, 10);
    let formatted = '';
    if (digits.length > 0) {
      formatted = '(' + digits.substring(0, 3);
    }
    if (digits.length >= 4) {
      formatted += ') ' + digits.substring(3, 6);
    }
    if (digits.length >= 7) {
      formatted += '-' + digits.substring(6, 10);
    }
    onChange(formatted);
  };

  return (
    <Input
      label={label}
      name={name}
      type="tel"
      value={value}
      onChange={handlePhoneChange}
      error={error}
      maxLength={14}
      placeholder="(555) 555-5555"
    />
  );
};

export default PhoneInput;
