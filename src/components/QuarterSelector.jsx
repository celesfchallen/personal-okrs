import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

import CustomCombobox from './CustomCombobox';

const QuarterSelector = ({ currentQuarter, onQuarterChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    if (currentQuarter) {
      const [q, y] = currentQuarter.split(' ');
      setSelectedQuarter(q);
      setSelectedYear(y);
    }
  }, [currentQuarter]);

  const handleApply = () => {
    onQuarterChange(`${selectedQuarter} ${selectedYear}`);
    setIsModalOpen(false);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - 25 + i);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 text-lg font-semibold text-slate-400 hover:text-slate-300"
      >
        <span>{currentQuarter}</span>
        <ChevronDown size={20} />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
          <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-xs text-slate-300">
            <h3 className="text-xl font-bold mb-4 text-white">Select Quarter</h3>
            <div className="flex items-center gap-4 mb-6">
              {/* Quarter Dropdown */}
              <div className="relative flex-1">
                <label className="block text-sm font-medium mb-1">Quarter</label>
                <select
                  value={selectedQuarter}
                  onChange={(e) => setSelectedQuarter(e.target.value)}
                  className="appearance-none w-full bg-slate-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Q1">Q1</option>
                  <option value="Q2">Q2</option>
                  <option value="Q3">Q3</option>
                  <option value="Q4">Q4</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-10 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              {/* Year Combobox */}
              <div className="relative flex-1">
                <label className="block text-sm font-medium mb-1">Year</label>
                <CustomCombobox
                  options={years}
                  value={selectedYear}
                  onChange={setSelectedYear}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="py-2 px-4 border border-slate-600 rounded-md shadow-sm text-sm font-medium hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuarterSelector;
