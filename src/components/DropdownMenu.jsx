import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Download, Upload } from 'lucide-react';
import { useOkr } from '../contexts/OkrContext';

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { okrs, setOkrs } = useOkr();
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(okrs, null, 2)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'personal-okrs.json';
    link.click();
    setIsOpen(false);
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedOkrs = JSON.parse(e.target.result);
          // TODO: Add more robust validation
          if (Array.isArray(importedOkrs)) {
            setOkrs(importedOkrs);
          } else {
            alert('Invalid JSON format.');
          }
        } catch (error) {
          alert('Error parsing JSON file.');
        }
      };
      reader.readAsText(file);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-slate-700"
        aria-label="Options menu"
      >
        <MoreVertical size={24} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-20">
          <ul>
            <li>
              <button
                onClick={handleExport}
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
              >
                <Download size={16} />
                Export JSON
              </button>
            </li>
            <li>
              <button
                onClick={handleImportClick}
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700"
              >
                <Upload size={16} />
                Import JSON
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".json"
              />
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
