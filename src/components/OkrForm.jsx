import { useState, useEffect } from 'react';
import { useOkr } from '../contexts/OkrContext';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2 } from 'lucide-react';

const OkrForm = ({ isOpen, onClose, objectiveToEdit, currentQuarter }) => {
  const { addObjective, updateObjective } = useOkr();
  const [objective, setObjective] = useState({
    title: '',
    krs: [],
    quarter: currentQuarter,
  });

  useEffect(() => {
    if (objectiveToEdit) {
      setObjective(objectiveToEdit);
    } else {
      setObjective({
        title: '',
        krs: [],
        quarter: currentQuarter,
      });
    }
  }, [objectiveToEdit, isOpen, currentQuarter]);

  const handleObjectiveChange = (e) => {
    const { name, value } = e.target;
    setObjective({ ...objective, [name]: value });
  };

  const handleKrChange = (index, e) => {
    const { name, value } = e.target;
    const krs = [...objective.krs];
    krs[index][name] = name === 'title' || name === 'unit' || name === 'period' ? value : Number(value);
    setObjective({ ...objective, krs });
  };
  
  const handleKrTypeChange = (index, newType) => {
    const krs = [...objective.krs];
    const oldKr = krs[index];
    let newKr = { id: oldKr.id, title: oldKr.title, type: newType };

    switch (newType) {
      case 'numeric':
        newKr = { ...newKr, initialValue: 0, currentValue: 0, targetValue: 100, unit: '' };
        break;
      case 'boolean':
        newKr = { ...newKr, currentValue: 0 };
        break;
      case 'frequency':
        newKr = { ...newKr, targetValue: 4, period: 'weekly', completedDays: [] };
        break;
      default:
        break;
    }

    krs[index] = newKr;
    setObjective({ ...objective, krs });
  };

  const addKr = () => {
    setObjective({
      ...objective,
      krs: [
        ...objective.krs,
        {
          id: uuidv4(),
          title: '',
          type: 'numeric',
          initialValue: 0,
          currentValue: 0,
          targetValue: 100,
          unit: '',
        },
      ],
    });
  };

  const removeKr = (index) => {
    const krs = [...objective.krs];
    krs.splice(index, 1);
    setObjective({ ...objective, krs });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedObjective = {
      ...objective,
      krs: objective.krs.map(kr => {
        const newKr = {...kr};
        if (kr.type === 'numeric' || kr.type === 'frequency') {
            newKr.targetValue = Number(kr.targetValue) || 0;
        }
        if (kr.type === 'numeric') {
            newKr.initialValue = Number(kr.initialValue) || 0;
            newKr.currentValue = Number(kr.currentValue) || 0;
        }
        // Ensure completedDays exists for frequency
        if (kr.type === 'frequency' && !newKr.completedDays) {
          newKr.completedDays = [];
        }
        return newKr;
      })
    }
    if (processedObjective.id) {
      updateObjective(processedObjective);
    } else {
      addObjective(processedObjective);
    }
    onClose();
  };

  if (!isOpen) return null;

  const inputClasses = "mt-1 block w-full rounded-md bg-slate-700 border-slate-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
      <div className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-lg max-h-full overflow-y-auto text-slate-300">
        <h2 className="text-2xl font-bold mb-4 text-white">
          {objective.id ? 'Edit Objective' : 'New Objective'}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Objective fields */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium">Objective Title</label>
            <input type="text" name="title" value={objective.title} onChange={handleObjectiveChange} className={inputClasses} required />
          </div>

          {/* Key Results */}
          <h3 className="text-xl font-semibold my-4 text-white">Key Results</h3>
          {objective.krs.map((kr, index) => (
            <div key={kr.id || index} className="grid grid-cols-1 gap-4 mb-4 p-4 border border-slate-700 rounded-md">
                <div className="flex justify-between items-start">
                    <input type="text" name="title" value={kr.title} onChange={(e) => handleKrChange(index, e)} placeholder="KR Title" className={`${inputClasses} w-full`} required />
                    <button type="button" onClick={() => removeKr(index)} className="ml-2 flex-shrink-0 w-8 h-8 flex items-center justify-center bg-red-600 text-white rounded-full hover:bg-red-700"><Trash2 size={16} /></button>
                </div>
                
                <select name="type" value={kr.type} onChange={(e) => handleKrTypeChange(index, e.target.value)} className={inputClasses}>
                    <option value="numeric">Numeric</option>
                    <option value="boolean">Boolean (Done/Not Done)</option>
                    <option value="frequency">Frequency (Habit)</option>
                </select>

                {kr.type === 'numeric' && (
                    <div className="grid grid-cols-3 gap-2">
                        <input type="number" name="initialValue" value={kr.initialValue} onChange={(e) => handleKrChange(index, e)} placeholder="Initial" className={inputClasses} />
                        <input type="number" name="currentValue" value={kr.currentValue} onChange={(e) => handleKrChange(index, e)} placeholder="Current" className={inputClasses} />
                        <input type="number" name="targetValue" value={kr.targetValue} onChange={(e) => handleKrChange(index, e)} placeholder="Target" className={inputClasses} />
                    </div>
                )}
                {kr.type === 'frequency' && (
                    <div className="grid grid-cols-2 gap-2">
                        <input type="number" name="targetValue" value={kr.targetValue} onChange={(e) => handleKrChange(index, e)} placeholder="How many times?" className={inputClasses} />
                        <select name="period" value={kr.period} onChange={(e) => handleKrChange(index, e)} className={inputClasses}>
                            <option value="weekly">per Week</option>
                            <option value="monthly">per Month</option>
                        </select>
                    </div>
                )}
            </div>
          ))}
          <button type="button" onClick={addKr} className="flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300"><Plus size={16} /> Add Key Result</button>

          {/* Form actions */}
          <div className="mt-6 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="py-2 px-4 border border-slate-600 rounded-md shadow-sm text-sm font-medium hover:bg-slate-700">Cancel</button>
            <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">{objective.id ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OkrForm;
