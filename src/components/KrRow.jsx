import { calculateKrProgress } from '../utils/calculateProgress';

const KrRow = ({ kr }) => {
  const progress = calculateKrProgress(kr);

  return (
    <div className="py-3 border-b last:border-b-0 border-slate-700">
      <div className="flex justify-between items-center mb-1">
        <p className="font-medium text-slate-300">{kr.title}</p>
        <span className="font-semibold text-slate-300">{progress}%</span>
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
        {kr.type === 'metric' ? (
          <>
            <span>{kr.initialValue}</span>
            <span>{`Current: ${kr.currentValue}`}</span>
            <span>{kr.targetValue}</span>
          </>
        ) : (
          <span>{kr.currentValue === kr.targetValue ? 'Completed' : 'Pending'}</span>
        )}
      </div>
    </div>
  );
};

export default KrRow;

