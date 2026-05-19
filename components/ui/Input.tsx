'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-dark-textSecondary">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-textSecondary">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full h-14 px-4 bg-dark-card border rounded-xl text-dark-text placeholder:text-dark-textSecondary
              focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 
              transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
              ${icon ? 'pl-12' : ''}
              ${error ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-dark-border'}
              ${className}`}
            {...props}
          />
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-danger"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;