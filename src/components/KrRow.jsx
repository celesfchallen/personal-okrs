import { useOkr } from '../contexts/OkrContext';
import { calculateKrProgress } from '../utils/calculateProgress';

const KrRow = ({ kr, objective }) => {
  const { updateObjective } = useOkr();
  const progress = calculateKrProgress(kr);

  const handleKrUpdate = (updatedKr) => {
    const updatedKrs = objective.krs.map((k) =>
      k.id === updatedKr.id ? updatedKr : k
    );
    updateObjective({ ...objective, krs: updatedKrs });
  };

  const handleBooleanKrUpdate = () => {
    handleKrUpdate({ ...kr, currentValue: kr.currentValue ? 0 : 1 });
  };

  const handleFrequencyKrUpdate = () => {
    const completedCount = kr.completedDays?.length || 0;
    let newCompletedDays = [...(kr.completedDays || [])];

    if (completedCount < kr.targetValue) {
      newCompletedDays.push(new Date().toISOString());
    } else {
      // Optional: Reset if target is met and user clicks again
      newCompletedDays = [];
    }
    handleKrUpdate({ ...kr, completedDays: newCompletedDays });
  };

  const handleNumericKrUpdate = (amount) => {
    const newValue = kr.currentValue + amount;
    if (newValue >= kr.initialValue && newValue <= kr.targetValue) {
      handleKrUpdate({ ...kr, currentValue: newValue });
    }
  };

  const handlers = {
    boolean: handleBooleanKrUpdate,
    frequency: handleFrequencyKrUpdate,
    numeric: handleNumericKrUpdate,
  };

  return (
    <div className="py-3 border-b last:border-b-0 border-slate-700">
      <div className="flex justify-between items-center mb-1">
        <p className="font-medium text-slate-300">{kr.title}</p>
        <span className="font-semibold text-slate-300">{Math.round(progress)}%</span>
      </div>
      <div className="relative w-full">
        <div className="overflow-hidden h-2 text-xs flex rounded bg-slate-700">
          <div
            style={{ width: `${progress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-slate-400"
          ></div>
        </div>
      </div>
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <KrProgressDetails kr={kr} handler={handlers[kr.type]} />
      </div>
    </div>
  );
};

const KrProgressDetails = ({ kr, handler }) => {
  switch (kr.type) {
    case 'numeric':
      return (
        <div className="flex items-center justify-between w-full">
          <span>{kr.initialValue}</span>
          <div className="flex items-center gap-2">
            <button onClick={() => handler(-1)} className="px-2 bg-slate-600 rounded">-</button>
            <span>{`Current: ${kr.currentValue}`}</span>
            <button onClick={() => handler(1)} className="px-2 bg-slate-600 rounded">+</button>
          </div>
          <span>{kr.targetValue}</span>
        </div>
      );
    case 'boolean':
      return (
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={kr.currentValue}
            onChange={handler}
            className="form-checkbox h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
          />
          <span>{kr.currentValue ? 'Completed' : 'Pending'}</span>
        </label>
      );
    case 'frequency':
      return (
        <div className="flex items-center space-x-2 w-full">
          <span className='flex-shrink-0'>{`${kr.completedDays?.length || 0} of ${kr.targetValue} ${kr.period === 'weekly' ? 'times' : ''}`}</span>
          <div className="flex items-center space-x-1 cursor-pointer" onClick={handler}>
            {Array.from({ length: kr.targetValue }).map((_, i) => (
              <div
                key={i}
                className={`h-4 w-4 rounded ${i < (kr.completedDays?.length || 0) ? 'bg-green-500' : 'bg-gray-700'}`}
              ></div>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default KrRow;
