import { useState } from 'react';
import { ChevronDown, Edit, Trash2 } from 'lucide-react';
import { calculateObjectiveProgress } from '../utils/calculateProgress';
import { useOkr } from '../contexts/OkrContext';
import KrRow from './KrRow';

const OkrCard = ({ objective, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { deleteObjective } = useOkr();
  const progress = calculateObjectiveProgress(objective);

  return (
    <div className="bg-slate-800 shadow-md rounded-lg mb-4 text-white">
      <div
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold mt-2 text-slate-100">{objective.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
                <span className="text-2xl font-bold text-slate-100">{progress}%</span>
            </div>
            <ChevronDown
              className={`transform transition-transform text-slate-400 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>
        <div className="relative pt-4">
            <div className="overflow-hidden h-2 text-xs flex rounded bg-slate-700">
                <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"></div>
            </div>
        </div>
      </div>

      {isExpanded && (
        <div>
          <div className="p-4 border-t border-slate-700">
            <h4 className="font-semibold mb-2 text-slate-300">Key Results</h4>
            {objective.krs.map((kr) => (
              <KrRow key={kr.id} kr={kr} objective={objective} />
            ))}
          </div>
          <div className="p-4 bg-slate-900 flex justify-end gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(objective);
              }}
              className="w-11 h-11 flex items-center justify-center bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
              aria-label="Edit Objective"
            >
              <Edit size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if(window.confirm('Are you sure you want to delete this objective?')) {
                    deleteObjective(objective.id)
                }
              }}
              className="w-11 h-11 flex items-center justify-center bg-red-600 text-white rounded-full hover:bg-red-700"
              aria-label="Delete Objective"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OkrCard;

