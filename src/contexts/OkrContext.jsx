import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

const OkrContext = createContext();

export const useOkr = () => useContext(OkrContext);

const initialData = [
    {
      id: 'obj-1',
      title: 'Mejorar la satisfacción del cliente',
      category: 'Customer Success',
      quarter: 'Q1',
      krs: [
        {
          id: 'kr-1-1',
          title: 'Aumentar el NPS de 8 a 9',
          type: 'metric',
          initialValue: 8,
          targetValue: 9,
          currentValue: 8.5,
          weight: 0.5,
        },
        {
          id: 'kr-1-2',
          title: 'Reducir el tiempo de respuesta del soporte de 24h a 12h',
          type: 'metric',
          initialValue: 24,
          targetValue: 12,
          currentValue: 18,
          weight: 0.3,
        },
        {
          id: 'kr-1-3',
          title: 'Lanzar el nuevo portal de ayuda',
          type: 'milestone',
          initialValue: 0,
          targetValue: 1,
          currentValue: 1,
          weight: 0.2,
        },
      ],
    },
    {
      id: 'obj-2',
      title: 'Lanzar la nueva versión del producto',
      category: 'Product',
      quarter: 'Q1',
      krs: [
        {
          id: 'kr-2-1',
          title: 'Completar el 100% de las historias de usuario planificadas',
          type: 'metric',
          initialValue: 0,
          targetValue: 100,
          currentValue: 70,
          weight: 0.6,
        },
        {
          id: 'kr-2-2',
          title: 'Realizar 10 entrevistas con usuarios beta',
          type: 'metric',
          initialValue: 0,
          targetValue: 10,
          currentValue: 10,
          weight: 0.4,
        },
      ],
    },
];


export const OkrProvider = ({ children }) => {
  const [okrs, setOkrs] = useLocalStorage('okrs', initialData);

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
        addObjective,
        updateObjective,
        deleteObjective,
      }}
    >
      {children}
    </OkrContext.Provider>
  );
};
