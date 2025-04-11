import { useState } from 'react';

interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export default function Toggle({ checked = false, onChange, disabled = false }: ToggleProps) {
  const [isChecked, setIsChecked] = useState(checked);
  
  const handleToggle = () => {
    if (disabled) return;
    
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    
    if (onChange) {
      onChange(newChecked);
    }
  };

  return (
    <button
      type="button"
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full 
        transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
        ${isChecked ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      role="switch"
      aria-checked={isChecked}
      onClick={handleToggle}
      disabled={disabled}
    >
      <span
        className={`
          inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform
          ${isChecked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );
} 