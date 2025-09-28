import React, { useState, useEffect } from 'react';
import InputField from '@/components/ui/InputField/InputField';

interface UserFormProps {
  username: string;
  onUsernameChange: (newUsername: string) => void;
  isEditing?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ username, onUsernameChange, isEditing = false }) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!isEditing) {
      setInputValue('');
    }
  }, [username, isEditing]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onUsernameChange(newValue);
  };

  return (
    <div className="flex-1 max-sm:w-full">
      <InputField
        label="Username"
        type="text"
        placeholder={username}
        value={inputValue}
        onChange={handleChange}
        className="mb-3"
      />
    </div>
  );
};

export default UserForm;
