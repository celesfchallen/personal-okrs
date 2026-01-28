import { useOkr } from '../contexts/OkrContext';
import { getWeekDays, isSameDay } from '../utils/dateUtils';

const WeeklyTracker = ({ kr, objective }) => {
  const { updateKr } = useOkr();
  const weekDays = getWeekDays(); // Gets the current week

  const handleDayToggle = (day) => {
    const isDayCompleted = kr.completedDays?.some(completedDay => isSameDay(completedDay, day));
    let newCompletedDays;

    if (isDayCompleted) {
      newCompletedDays = kr.completedDays.filter(completedDay => !isSameDay(completedDay, day));
    } else {
      newCompletedDays = [...(kr.completedDays || []), day.toISOString()];
    }

    updateKr(objective.id, kr.id, { completedDays: newCompletedDays });
  };

  return (
    <div className="flex justify-center items-center gap-2">
      {weekDays.map((day, index) => {
        const isCompleted = kr.completedDays?.some(completedDay => isSameDay(completedDay, day));
        const dayInitial = day.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);

        return (
          <div key={index} className="flex flex-col items-center gap-1">
            <span className="text-xs text-slate-500">{dayInitial}</span>
            <button
              onClick={() => handleDayToggle(day)}
              className={`w-6 h-6 rounded-full transition-colors ${
                isCompleted ? 'bg-emerald-500' : 'bg-slate-600 hover:bg-slate-500'
              }`}
              aria-label={`Mark day ${index + 1} as ${isCompleted ? 'incomplete' : 'complete'}`}
            ></button>
          </div>
        );
      })}
    </div>
  );
};

export default WeeklyTracker;
