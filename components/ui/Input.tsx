import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  containerClassName?: string;
  endAdornment?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, id, containerClassName, endAdornment, ...props }) => {
  return (
    <div className={containerClassName}>
      <label htmlFor={id} className="block text-sm font-medium text-kia-gray">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          id={id}
          {...props}
          className={`block w-full bg-kia-dark-2 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-kia-primary focus:border-kia-primary sm:text-sm text-white ${endAdornment ? 'pr-10' : ''}`}
        />
        {endAdornment && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {endAdornment}
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;