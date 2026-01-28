import { useState } from 'react';
import { ChevronDown, Edit, Trash2 } from 'lucide-react';
import { calculateObjectiveProgress } from '../utils/calculateProgress';
import { useOkr } from '../contexts/OkrContext';
import KrRow from './KrRow';
import CircularProgress from './CircularProgress';

const OkrCard = ({ objective, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { deleteObjective } = useOkr();
  const progress = calculateObjectiveProgress(objective);

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 shadow-2xl shadow-slate-950/50 rounded-xl mb-4 text-white">
      <div
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-start">
          <div className='flex-grow pr-4'>
            <h3 className="text-lg font-bold text-slate-100">{objective.title}</h3>
          </div>
          <div className="flex items-center gap-4">
            <CircularProgress progress={progress} />
            <ChevronDown
              className={`transform transition-transform text-slate-400 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div>
          <div className="pb-2 pt-0 px-4">
            {objective.krs.map((kr) => (
              <KrRow key={kr.id} kr={kr} objective={objective} />
            ))}
          </div>
          <div className="p-2 px-4 bg-slate-900/50 rounded-b-xl flex justify-end gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(objective);
              }}
              className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
              aria-label="Edit Objective"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if(window.confirm('Are you sure you want to delete this objective?')) {
                    deleteObjective(objective.id)
                }
              }}
              className="w-10 h-10 flex items-center justify-center bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              aria-label="Delete Objective"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OkrCard;

