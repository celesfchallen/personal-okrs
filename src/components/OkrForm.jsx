import { useState, useEffect, useRef } from 'react';
import { useOkr } from '../contexts/OkrContext';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, X, Settings2, Target, CheckCircle, Calendar } from 'lucide-react';
import { useOnClickOutside } from '../hooks/useOnClickOutside';

const KrIcon = ({ type }) => {
    switch(type) {
        case 'numeric': return <Target size={16} className="text-slate-500" />;
        case 'boolean': return <CheckCircle size={16} className="text-slate-500" />;
        case 'frequency': return <Calendar size={16} className="text-slate-500" />;
        default: return null;
    }
}

const OkrForm = ({ isOpen, onClose, objectiveToEdit, currentQuarter }) => {
  const { addObjective, updateObjective } = useOkr();
  const [objective, setObjective] = useState({ title: '', krs: [], quarter: currentQuarter });
  const [editingKrId, setEditingKrId] = useState(null);
  const [advancedKrId, setAdvancedKrId] = useState(null);

  const modalRef = useRef();
  useOnClickOutside(modalRef, onClose);

  useEffect(() => {
    if (objectiveToEdit) {
      setObjective(objectiveToEdit);
    } else {
      setObjective({ title: '', krs: [], quarter: currentQuarter });
    }
    setEditingKrId(null);
    setAdvancedKrId(null);
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
      case 'numeric': newKr = { ...newKr, initialValue: 0, currentValue: 0, targetValue: 100, unit: '' }; break;
      case 'boolean': newKr = { ...newKr, currentValue: 0 }; break;
      case 'frequency': newKr = { ...newKr, targetValue: 4, period: 'weekly', completedDays: [] }; break;
      default: break;
    }
    krs[index] = newKr;
    setObjective({ ...objective, krs });
  };

  const addKr = () => {
    const newKr = { id: uuidv4(), title: '', type: 'numeric', initialValue: 0, currentValue: 0, targetValue: 100, unit: '' };
    setObjective({ ...objective, krs: [...objective.krs, newKr] });
    setEditingKrId(newKr.id);
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
        if (kr.type === 'frequency' && !newKr.completedDays) newKr.completedDays = [];
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

  const baseInputClasses = "block w-full border-transparent rounded-lg sm:text-sm text-white";
  const focusClasses = "focus:border-emerald-500 focus:ring-emerald-500";
  const titleInputClasses = `${baseInputClasses} bg-transparent text-4xl font-bold p-0 focus:ring-0 text-slate-100 placeholder-slate-500`;
  const regularInputClasses = `${baseInputClasses} bg-slate-800/50 ${focusClasses} px-3 py-2`;
  
  const renderKrSummary = (kr) => {
    switch(kr.type) {
      case 'numeric': return `Goal: ${kr.targetValue} ${kr.unit || ''}`;
      case 'boolean': return kr.currentValue ? 'Done' : 'Not Done';
      case 'frequency': return `${kr.targetValue} times`;
      default: return '';
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xl z-50 flex justify-center items-end sm:items-center p-0 sm:p-4">
      <div ref={modalRef} className="bg-slate-800/80 border border-slate-700/80 p-5 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[95vh] flex flex-col text-slate-300">
        <div className="flex-shrink-0 mb-4 text-3xl">
            <input type="text" name="title" value={objective.title} onChange={handleObjectiveChange} className={`${titleInputClasses} font-bold font-size-inherit`} placeholder="Objective Title..." required />
        </div>
        
        <div className="flex-grow overflow-y-auto space-y-2 -mr-2 pr-2">
            {objective.krs.map((kr, index) => (
                <div key={kr.id}>
                {editingKrId === kr.id ? (
                    <div className="bg-slate-900/50 p-3 rounded-lg space-y-3 shadow-inner shadow-slate-900/50">
                        <div className="flex justify-between items-center">
                            <input type="text" name="title" value={kr.title} onChange={(e) => handleKrChange(index, e)} placeholder="Key Result Title" className={`${regularInputClasses} flex-grow`} required />
                            <button type="button" onClick={() => removeKr(index)} className="ml-3 text-slate-500 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>
                        <div className='grid grid-cols-2 gap-x-3 gap-y-2'>
                            <div><select name="type" value={kr.type} onChange={(e) => handleKrTypeChange(index, e.target.value)} className={regularInputClasses}><option value="numeric">Numeric</option><option value="boolean">Done/Not Done</option><option value="frequency">Frequency</option></select></div>
                            {kr.type === 'boolean' && <div />}
                            {kr.type === 'frequency' && (<><input type="number" name="targetValue" value={kr.targetValue} onChange={(e) => handleKrChange(index, e)} className={regularInputClasses} placeholder="Times" /><select name="period" value={kr.period} onChange={(e) => handleKrChange(index, e)} className={regularInputClasses}><option value="weekly">per Week</option><option value="monthly">per Month</option></select></>)}
                            {kr.type === 'numeric' && (
                                <div className="col-span-2 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <label className="text-sm text-slate-400">Goal:</label>
                                        <input type="number" name="targetValue" value={kr.targetValue} onChange={(e) => handleKrChange(index, e)} className={`${regularInputClasses} w-24 text-center`} placeholder="100" />
                                        <input type="text" name="unit" value={kr.unit} onChange={(e) => handleKrChange(index, e)} className={`${regularInputClasses} flex-grow`} placeholder="Unit (e.g. 'steps')" />
                                        <button type="button" onClick={() => setAdvancedKrId(advancedKrId === kr.id ? null : kr.id)} className={`p-1 rounded ${advancedKrId === kr.id ? 'bg-slate-700' : ''} text-slate-500 hover:text-slate-300`}><Settings2 size={16}/></button>
                                    </div>
                                    {advancedKrId === kr.id && (
                                        <div className="flex items-center gap-2 pl-10">
                                            <label className="text-sm text-slate-400">Initial:</label>
                                            <input type="number" name="initialValue" value={kr.initialValue} onChange={(e) => handleKrChange(index, e)} className={`${regularInputClasses} w-24 text-center`} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <button type="button" onClick={() => setEditingKrId(null)} className="w-full text-center py-1.5 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm font-medium">Done</button>
                    </div>
                ) : (
                    <div onClick={() => setEditingKrId(kr.id)} className="p-2 px-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-slate-700/50 text-slate-400 hover:text-slate-200">
                        <div className="flex items-center gap-2">
                            <KrIcon type={kr.type} />
                            <span>{kr.title || 'Untitled KR'}</span>
                        </div>
                        <span className="text-sm">{renderKrSummary(kr)}</span>
                    </div>
                )}
                </div>
            ))}
            <button type="button" onClick={addKr} className="w-full flex items-center justify-center gap-2 py-2 px-4 border-2 border-dashed border-slate-700 rounded-lg text-slate-500 hover:border-slate-600 hover:text-slate-400 transition-colors">
                <Plus size={16} /> Add Key Result
            </button>
        </div>

        <div className="mt-4 flex-shrink-0">
          <button type="submit" onClick={handleSubmit} className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">{objective.id ? 'Update Objective' : 'Create Objective'}</button>
        </div>
      </div>
    </div>
  );
};

export default OkrForm;
