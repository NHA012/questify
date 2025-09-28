import React, { useState } from 'react';
import styles from './ListField.module.css';

const PlusIcon: React.FC = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[16px] h-[16px]"
    >
      <path
        d="M2.5 8H13.5"
        stroke="#00ADB5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 2.5V13.5"
        stroke="#00ADB5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const TrashIcon: React.FC = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[20px] h-[20px]"
    >
      <path
        d="M16.875 4.375L3.125 4.37501"
        stroke="#E34444"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.125 8.125V13.125"
        stroke="#E34444"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.875 8.125V13.125"
        stroke="#E34444"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.625 4.375V16.25C15.625 16.4158 15.5592 16.5747 15.4419 16.6919C15.3247 16.8092 15.1658 16.875 15 16.875H5C4.83424 16.875 4.67527 16.8092 4.55806 16.6919C4.44085 16.5747 4.375 16.4158 4.375 16.25V4.375"
        stroke="#E34444"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.125 4.375V3.125C13.125 2.79348 12.9933 2.47554 12.7589 2.24112C12.5245 2.0067 12.2065 1.875 11.875 1.875H8.125C7.79348 1.875 7.47554 2.0067 7.24112 2.24112C7.0067 2.47554 6.875 2.79348 6.875 3.125V4.375"
        stroke="#E34444"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

interface ListFieldProps {
  label: string;
  description: string;
  examples: string[];
  className?: string;
  characterLimit?: number;
  items: string[];
  onChange?: ([]) => void;
}

const ListField: React.FC<ListFieldProps> = ({
  label,
  description,
  examples,
  className = '',
  characterLimit = 0,
  items = [''],
  onChange,
}) => {
  const [requirements, setRequirements] = useState<string[]>(items.length > 0 ? items : ['']);

  const handleInputChange = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
    if (onChange) onChange(newRequirements);
  };

  const addNewRequirement = () => {
    setRequirements([...requirements, '']);
  };

  const deleteRequirement = (index: number) => {
    if (requirements.length > 1) {
      const newRequirements = requirements.filter((_, i) => i !== index);
      setRequirements(newRequirements);
    } else {
      setRequirements(['']);
    }
  };

  return (
    <section className={`${styles.div} ${className}`}>
      <header className={styles.div2}>
        <h2 className="mb-1 text-sm font-medium text-neutral-900 block">{label}</h2>
        <button
          className={styles.div4}
          onClick={addNewRequirement}
          aria-label="Add new requirement"
        >
          <PlusIcon />
          <span className={styles.div5}>Add new</span>
        </button>
      </header>

      <p className="mb-1 text-sm font-medium text-neutral-600 block">{description}</p>

      {requirements.map((requirement, index) => (
        <div key={index} className={styles.div7}>
          <div
            className={`${styles.div8} hover:shadow-[0px_4px_10px_rgba(0,0,0,0.25)] focus-within:shadow-[0px_4px_10px_rgba(0,0,0,0.25)]`}
          >
            <textarea
              className={styles.inputField}
              value={requirement}
              onChange={(e) => handleInputChange(index, e.target.value)}
              maxLength={120}
              aria-label="Course requirement"
            />
            <span className={styles.div9} style={{ display: requirement ? 'none' : 'block' }}>
              {examples[index % examples.length]}
            </span>
            <span className={styles.div10}>
              {requirement.length}/{characterLimit}
            </span>
            <button
              onClick={() => deleteRequirement(index)}
              aria-label="Delete requirement"
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
              }}
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ListField;
