
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({ label, error, name, containerClassName, ...props }) => {
  return (
    <div className={containerClassName}>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={name}
          name={name}
          className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            error ? 'border-red-500' : 'border-slate-300'
          }`}
          {...props}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
