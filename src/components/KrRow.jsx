import { useOkr } from '../contexts/OkrContext';
import { calculateKrProgress } from '../utils/calculateProgress';
import EditableField from './EditableField';
import WeeklyTracker from './WeeklyTracker';
import { Check, Minus, Plus } from 'lucide-react';
import { isSameDay } from '../utils/dateUtils';

const KrRow = ({ kr, objective }) => {
    const progress = calculateKrProgress(kr);
    const isBooleanCompleted = kr.type === 'boolean' && kr.currentValue === 1;

    const { updateKr } = useOkr();
    const handleTitleSave = (newTitle) => {
        if (newTitle.trim()) {
            updateKr(objective.id, kr.id, { title: newTitle });
        }
    };

    return (
        <div className="py-3 border-b last:border-b-0 border-slate-700 group">
            <div className="flex justify-between items-center">
                <div className={`flex items-center gap-2 flex-grow ${isBooleanCompleted ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                    <p className="font-medium">{kr.title}</p>
            
                </div>
                <div className="flex-shrink-0 ml-4">
                    <KrControls kr={kr} objective={objective} />
                </div>
            </div>
            <div className="mt-2">
                <KrProgressVisual kr={kr} progress={progress} objective={objective} />
            </div>
        </div>
    );
};

const KrControls = ({ kr, objective }) => {
    const { updateKr } = useOkr();

    const handleNumericValueUpdate = (field, value) => {
        const numValue = Number(value);
        if (!isNaN(numValue)) {
            updateKr(objective.id, kr.id, { [field]: numValue });
        }
    };

    const handleBooleanToggle = () => {
        const newValue = kr.currentValue ? 0 : 1;
        updateKr(objective.id, kr.id, { currentValue: newValue });
    };

    const handleFrequencyChange = (amount) => {
        let completedDays = kr.completedDays || [];
        if (amount > 0) {
            // Add today's date if it's not already there
            const today = new Date();
            if (!completedDays.some(d => isSameDay(d, today))) {
                completedDays.push(today.toISOString());
            }
        } else if (amount < 0) {
            // Remove the most recent day
            if (completedDays.length > 0) {
                completedDays.pop();
            }
        }
        updateKr(objective.id, kr.id, { completedDays });
    };

    switch (kr.type) {
        case 'numeric':
            const isNumericComplete = calculateKrProgress(kr) >= 100;
            return (
                <div className={`flex items-center gap-2 text-sm ${isNumericComplete ? 'text-emerald-500' : 'text-slate-300'}`}>
                    <EditableField
                        initialValue={kr.currentValue}
                        onSave={(val) => handleNumericValueUpdate('currentValue', val)}
                        className="w-12 text-center bg-transparent"
                        inputType="number"
                    />
                    <span className="text-slate-500">/</span>
                    <EditableField
                        initialValue={kr.targetValue}
                        onSave={(val) => handleNumericValueUpdate('targetValue', val)}
                        className="w-12 text-center bg-transparent"
                        inputType="number"
                    />
                    <span className="text-slate-400">{kr.unit || ''}</span>
                </div>
            );
        case 'boolean':
            return (
                <button
                    onClick={handleBooleanToggle}
                    className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${kr.currentValue ? 'bg-emerald-500 text-white' : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                >
                    {kr.currentValue ? <Check size={16} /> : null}
                </button>
            );
        case 'frequency':
            const completedCount = kr.completedDays?.length || 0;
            const isFrequencyComplete = completedCount >= kr.targetValue;
            return (
                <div className="flex items-center gap-2">
                    <button onClick={() => handleFrequencyChange(-1)} className="p-1 rounded-full bg-slate-700 hover:bg-slate-600 disabled:opacity-50" disabled={completedCount <= 0}><Minus size={14} /></button>
                    <span className={`font-bold text-lg ${isFrequencyComplete ? 'text-emerald-500' : ''}`}>{completedCount}</span>
                    <span className="text-slate-500">/</span>
                    <EditableField
                        initialValue={kr.targetValue}
                        onSave={(val) => handleNumericValueUpdate('targetValue', val)}
                        className="w-8 text-center bg-transparent"
                        inputType="number"
                    />
                    <button onClick={() => handleFrequencyChange(1)} className="p-1 rounded-full bg-slate-700 hover:bg-slate-600"><Plus size={14} /></button>
                </div>
            );
        default:
            return null;
    }
}

const KrProgressVisual = ({ kr, progress, objective }) => {
    switch (kr.type) {
        case 'numeric':
            return (
                <div className="relative w-full pt-1">
                    <div className="overflow-hidden h-1.5 text-xs flex rounded bg-slate-700">
                        <div
                            style={{ width: `${progress}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500 transition-all duration-300"
                        ></div>
                    </div>
                </div>
            );
        case 'frequency':
            return <WeeklyTracker kr={kr} objective={objective} />;
        case 'boolean':
        default:
            return null;
    }
};

export default KrRow;
