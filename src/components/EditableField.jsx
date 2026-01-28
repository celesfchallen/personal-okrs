import { useState, useRef, useEffect } from 'react';

const EditableField = ({ initialValue, onSave, className, inputType = 'text' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (value !== initialValue) {
      onSave(value);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setValue(initialValue);
      setIsEditing(false);
    }
  };

  return isEditing ? (
    <input
      ref={inputRef}
      type={inputType}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleSave}
      onKeyDown={handleKeyDown}
      className={`${className} bg-slate-700 text-white rounded px-2 py-1 -my-1`}
    />
  ) : (
    <span onClick={() => setIsEditing(true)} className={`${className} cursor-pointer`}>
      {initialValue}
    </span>
  );
};

export default EditableField;
