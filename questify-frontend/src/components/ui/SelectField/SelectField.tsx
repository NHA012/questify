import React, { useEffect, useMemo, useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';

const BsChevronDownIcon = BsChevronDown as React.ElementType;

export interface SelectFieldProps {
  label: string;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  className?: string;
  value?: string;
  onChange?: (string) => void;
  error?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  placeholder = 'Select...',
  options = [],
  className = '',
  value = '',
  onChange = () => {},
  error,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const [chosenValue, setchosenValue] = useState(value);

  const handleChosenValueChange = (value: string) => {
    setchosenValue(value);
  };

  const handleSelectOption = (optionValue: string) => {
    handleChosenValueChange(optionValue);
    setIsOpen(false);
    if (onChange) onChange(optionValue);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get the selected option label
  const selectedOptionLabel = useMemo(() => {
    if (!chosenValue) return placeholder;
    const selectedOption = options.find((option) => option.value === chosenValue);
    return selectedOption ? selectedOption.label : placeholder;
  }, [chosenValue, options, placeholder]);

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      <label className="mb-2 text-sm font-medium text-neutral-900 block">{label}</label>
      <div
        className="relative rounded-[20px] hover:shadow-[rgba(0,0,0,0.25)] focus-within:shadow-[rgba(0,0,0,0.25)]"
        ref={dropdownRef}
      >
        <button
          type="button"
          onClick={handleToggleDropdown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className="flex w-full justify-between items-center py-3 pr-4 pl-5 h-12 bg-white rounded-[20px] border border-gray-200 border-solid max-sm:py-2.5 max-sm:pr-3.5 max-sm:pl-4"
        >
          <span
            className={`text-base leading-6 ${
              chosenValue ? 'text-neutral-800' : 'text-gray-400'
            } select-text`}
          >
            {selectedOptionLabel}
          </span>
          <BsChevronDownIcon />
        </button>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        {isOpen && options.length > 0 && (
          <ul
            role="listbox"
            className="absolute z-10 w-full mt-1 bg-white rounded-xl border border-gray-200 shadow-lg max-h-60 overflow-auto"
          >
            {options.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={chosenValue === option.value}
                onClick={() => handleSelectOption(option.value)}
                className={`px-5 py-3 cursor-pointer hover:bg-gray-50 ${
                  chosenValue === option.value ? 'bg-gray-100' : ''
                }`}
              >
                <span className="text-base leading-6 text-neutral-800">{option.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SelectField;
