import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomCombobox = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);
  
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setTimeout(() => {
        const selectedItem = listRef.current?.querySelector(`[data-value="${value}"]`);
        if (selectedItem) {
          selectedItem.scrollIntoView({ block: 'center' });
        }
      }, 0);
    }
  }, [isOpen, value]);

  const filteredOptions = options.filter(option =>
    option.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm || value}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setSearchTerm('');
            setIsOpen(true);
          }}
          className="w-full bg-slate-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute right-0 top-0 h-full px-2 flex items-center"
        >
            <ChevronDown size={16} className="text-slate-400" />
        </button>
      </div>

      {isOpen && (
        <ul ref={listRef} className="absolute z-10 w-full bg-slate-600 border border-slate-500 rounded-md mt-1 max-h-48 overflow-y-auto">
          {filteredOptions.map(option => (
            <li
              key={option}
              data-value={option}
              onClick={() => {
                onChange(option);
                setSearchTerm(option.toString());
                setIsOpen(false);
              }}
              className="px-3 py-2 text-white hover:bg-slate-700 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomCombobox;
