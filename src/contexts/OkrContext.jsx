import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentQuarter } from '../utils/dateUtils';

const OkrContext = createContext();

export const useOkr = () => useContext(OkrContext);

const currentQuarter = getCurrentQuarter();

const initialData = [
  {
    id: 'obj-1',
    title: 'Mejorar mi estado físico',
    quarter: currentQuarter,
    krs: [
      {
        id: 'kr-1-1',
        title: 'Caminar más de 8k pasos',
        type: 'frequency',
        targetValue: 4,
        period: 'weekly',
        completedDays: ['2024-05-20T10:00:00.000Z'],
      },
      {
        id: 'kr-1-2',
        title: 'Beber 2 litros de agua al día',
        type: 'frequency',
        targetValue: 7,
        period: 'weekly',
        completedDays: [
          '2024-05-20T11:00:00.000Z',
          '2024-05-21T11:00:00.000Z',
          '2024-05-22T11:00:00.000Z',
        ],
      },
    ],
  },
  {
    id: 'obj-2',
    title: 'Aprender a programar en React',
    quarter: currentQuarter,
    krs: [
      {
        id: 'kr-2-1',
        title: 'Completar el curso de React en Platzi',
        type: 'boolean',
        currentValue: 0,
      },
      {
        id: 'kr-2-2',
        title: 'Construir 3 proyectos personales',
        type: 'numeric',
        initialValue: 0,
        targetValue: 3,
        currentValue: 1,
        unit: 'proyectos'
      },
    ],
  },
  {
    id: 'obj-3',
    title: 'Planificar viaje a Japón',
    quarter: 'Q4 2025',
    krs: [
        {
            id: 'kr-3-1',
            title: 'Definir itinerario y presupuesto',
            type: 'boolean',
            currentValue: 0,
        }
    ]
  }
];

export const OkrProvider = ({ children }) => {
  const [okrs, setOkrs] = useLocalStorage('okrs', initialData);

  useEffect(() => {
    if (okrs === null || okrs.length === 0) {
      setOkrs(initialData);
    }
  }, []);

  const addObjective = (objective) => {
    const newObjective = { ...objective, id: uuidv4(), krs: objective.krs.map(kr => ({...kr, id: uuidv4()})) };
    setOkrs([...okrs, newObjective]);
  };

  const updateObjective = (updatedObjective) => {
    setOkrs(
      okrs.map((objective) =>
        objective.id === updatedObjective.id ? updatedObjective : objective
      )
    );
  };

  const deleteObjective = (objectiveId) => {
    setOkrs(okrs.filter((objective) => objective.id !== objectiveId));
  };

  return (
    <OkrContext.Provider
      value={{
        okrs,
        setOkrs,
        addObjective,
        updateObjective,
        deleteObjective,
      }}
    >
      {children}
    </OkrContext.Provider>
  );
};
