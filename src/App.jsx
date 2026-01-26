import { useState, useEffect } from 'react';

function App() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [items, setItems] = useState([]);
  const [newItemText, setNewItemText] = useState('');

  // Effect for the clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Effect to load items from localStorage on initial render
  useEffect(() => {
    try {
      const storedItems = localStorage.getItem('dynamic-items');
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error("Failed to parse items from localStorage", error);
    }
  }, []);

  // Effect to save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dynamic-items', JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (newItemText.trim() === '') {
      return; // Do not add empty items
    }
    const newItem = {
      id: Date.now(),
      text: newItemText,
    };
    setItems(prevItems => [...prevItems, newItem]);
    setNewItemText(''); // Clear the input field
  };
  
  const deleteItem = (id) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-5xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-white">
          Github Pages + React
        </h1>
        <p className="mt-2 text-xl text-gray-300">
          Test Application
        </p>
        <p className="mt-4 text-lg text-gray-400">
          {currentDateTime.toLocaleString()}
        </p>
      </header>

      <div className="w-full max-w-2xl mb-8">
        <div className="bg-gray-800 rounded-lg shadow-lg p-4">
          <textarea
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            className="w-full bg-gray-700 text-white rounded-md p-3 text-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Enter your text for the new item..."
            rows="3"
          ></textarea>
          <button 
            onClick={addItem}
            className="w-full mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md transition-colors duration-200"
          >
            Add New Item
          </button>
        </div>
      </div>

      <main className="w-full max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between gap-4">
                <p className="text-gray-300 whitespace-pre-wrap flex-grow break-words">{item.text}</p>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-red-600 rounded-full transition-colors duration-200 flex-shrink-0"
                  aria-label="Delete item"
                  title="Delete item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        {items.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p>No items yet. Add one using the form above!</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;