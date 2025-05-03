import React, { Fragment, useState, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';

export interface DropdownOption {
  id?: string;  // Made optional
  label: string;
  value: string;
  icon?: React.ReactNode;
  description?: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;  // Made optional when used with defaultValue + onSelect pattern
  onChange?: (value: string) => void;  // Made optional to support onSelect alternative
  onSelect?: (value: string) => void;  // Alternative to onChange for backward compatibility
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  defaultValue?: string;
}

export function Dropdown({
  options,
  value: externalValue,
  onChange,
  onSelect,
  label,
  placeholder = 'Select an option',
  error,
  disabled = false,
  fullWidth = false,
  className = '',
  defaultValue,
}: DropdownProps) {
  // Internal state for when value is not provided externally (controlled vs uncontrolled)
  const [internalValue, setInternalValue] = useState<string>(externalValue || defaultValue || '');
  
  // Use external value if provided (controlled component), otherwise use internal state
  const value = externalValue !== undefined ? externalValue : internalValue;
  
  // Update internal value if external value changes
  useEffect(() => {
    if (externalValue !== undefined) {
      setInternalValue(externalValue);
    }
  }, [externalValue]);
  
  // Update internal value if defaultValue is provided and no value is set
  useEffect(() => {
    if (defaultValue && !externalValue && !internalValue) {
      setInternalValue(defaultValue);
    }
  }, [defaultValue, externalValue, internalValue]);

  const selectedOption = options.find(option => option.value === value);

  // Handle value changes - call both onChange and onSelect if provided
  const handleChange = (val: string) => {
    // Update internal state if not controlled externally
    if (externalValue === undefined) {
      setInternalValue(val);
    }
    // Call appropriate handlers
    if (onChange) onChange(val);
    if (onSelect) onSelect(val);
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <Listbox value={value} onChange={handleChange} disabled={disabled}>
        <div className="relative">
          <Listbox.Button
            className={`relative w-full cursor-default rounded-md border ${
              error
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-800 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm ${
              disabled ? 'opacity-70 cursor-not-allowed bg-gray-100 dark:bg-gray-900' : ''
            }`}
          >
            <span className="block truncate">
              {selectedOption ? (
                <div className="flex items-center">
                  {selectedOption.icon && <span className="mr-2">{selectedOption.icon}</span>}
                  {selectedOption.label}
                </div>
              ) : (
                <span className="text-gray-400">{placeholder}</span>
              )}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {options.map((option) => (
                <Listbox.Option
                  key={option.id || option.value} // Use value as fallback if id is not provided
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-3 pr-9 ${
                      active ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
                    }`
                  }
                  value={option.value}
                >
                  {({ selected, active }) => (
                    <>
                      <div className="flex items-center">
                        {option.icon && <span className="mr-2">{option.icon}</span>}
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {option.label}
                        </span>
                        {option.description && (
                          <span className="ml-2 truncate text-xs text-gray-500 dark:text-gray-400">
                            {option.description}
                          </span>
                        )}
                      </div>

                      {selected ? (
                        <span
                          className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
                            active ? 'text-blue-600 dark:text-blue-400' : 'text-blue-600 dark:text-blue-400'
                          }`}
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-500">{error}</p>}
    </div>
  );
}