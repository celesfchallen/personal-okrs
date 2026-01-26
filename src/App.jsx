import { useState } from 'react';
import { useOkr } from './contexts/OkrContext';
import OkrCard from './components/OkrCard';
import OkrForm from './components/OkrForm';
import DropdownMenu from './components/DropdownMenu';
import { Plus } from 'lucide-react';
import { getCurrentQuarter, getNextQuarter, getPreviousQuarter } from './utils/dateUtils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function App() {
  const { okrs } = useOkr();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [objectiveToEdit, setObjectiveToEdit] = useState(null);
  const [currentQuarter, setCurrentQuarter] = useState(getCurrentQuarter());

  const handleOpenModal = () => {
    setObjectiveToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditObjective = (objective) => {
    setObjectiveToEdit(objective);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setObjectiveToEdit(null);
  };

  const filteredOkrs = (okrs || []).filter(
    (okr) => okr.quarter === currentQuarter
  );

  return (
    <div className="dark bg-gray-900 min-h-screen font-sans">
      <header className="bg-slate-800 shadow-md text-slate-100">
        <div className="max-w-4xl mx-auto py-4 px-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Personal OKRs</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentQuarter(getPreviousQuarter(currentQuarter))} className="p-2 rounded-full hover:bg-slate-700">
              <ChevronLeft size={20} />
            </button>
            <span className='text-lg font-semibold text-slate-400 w-28 text-center'>{currentQuarter}</span>
            <button onClick={() => setCurrentQuarter(getNextQuarter(currentQuarter))} className="p-2 rounded-full hover:bg-slate-700">
              <ChevronRight size={20} />
            </button>
          </div>
          <DropdownMenu />
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-5 pb-24">
        {filteredOkrs.length > 0 ? (
          filteredOkrs.map((objective) => (
            <OkrCard
              key={objective.id}
              objective={objective}
              onEdit={handleEditObjective}
            />
          ))
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-400">No objectives for this quarter.</p>
            <p className="text-slate-500 text-sm">Create a new one or navigate to another quarter.</p>
          </div>
        )}
      </main>

      <button
        onClick={handleOpenModal}
        className="fixed bottom-6 right-6 w-14 h-14 flex items-center justify-center bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        aria-label="Add Objective"
      >
        <Plus size={32} />
      </button>

      <OkrForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        objectiveToEdit={objectiveToEdit}
        currentQuarter={currentQuarter}
      />
    </div>
  );
}

export default App;

