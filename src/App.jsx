import { useState } from 'react';
import { useOkr } from './contexts/OkrContext';
import OkrCard from './components/OkrCard';
import OkrForm from './components/OkrForm';
import { Plus } from 'lucide-react';

function App() {
  const { okrs } = useOkr();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [objectiveToEdit, setObjectiveToEdit] = useState(null);

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

  return (
    <div className="dark bg-gray-900 min-h-screen font-sans">
      <header className="bg-slate-800 shadow-md">
        <div className="max-w-4xl mx-auto py-4 px-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-100">Personal OKRs</h1>
          <button
            onClick={handleOpenModal}
            className="w-11 h-11 flex items-center justify-center bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            aria-label="Add Objective"
          >
            <Plus size={24} />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-5">
        {okrs.map((objective) => (
          <OkrCard
            key={objective.id}
            objective={objective}
            onEdit={handleEditObjective}
          />
        ))}
      </main>

      <OkrForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        objectiveToEdit={objectiveToEdit}
      />
    </div>
  );
}

export default App;
