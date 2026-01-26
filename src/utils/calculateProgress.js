
export const calculateKrProgress = (kr) => {
  let progress = 0;
  switch (kr.type) {
    case 'numeric': {
      const { initialValue = 0, currentValue, targetValue } = kr;
      if (targetValue === initialValue) return 0;
      progress =
        ((currentValue - initialValue) / (targetValue - initialValue)) * 100;
      break;
    }
    case 'boolean': {
      const { currentValue } = kr;
      progress = currentValue ? 100 : 0;
      break;
    }
    case 'frequency': {
      const { completedDays = [], targetValue } = kr;
      if (targetValue === 0) return 0;
      progress = (completedDays.length / targetValue) * 100;
      break;
    }
    default:
      progress = 0;
  }

  return Math.max(0, Math.min(100, progress)); // Clamp between 0 and 100
};
  
  export const calculateObjectiveProgress = (objective) => {
    if (!objective.krs || objective.krs.length === 0) {
      return 0;
    }
  
    const totalWeight = objective.krs.reduce((sum, kr) => sum + (kr.weight || 0), 0);
  
    if (totalWeight === 0) {
      // If no weights are defined, calculate a simple average
      const simpleAverage =
        objective.krs.reduce((sum, kr) => sum + calculateKrProgress(kr), 0) /
        objective.krs.length;
      return Math.round(simpleAverage);
    }
  
    const weightedProgress = objective.krs.reduce((sum, kr) => {
      const progress = calculateKrProgress(kr);
      const weight = kr.weight || 0;
      return sum + (progress * weight);
    }, 0);
  
    const overallProgress = weightedProgress / totalWeight;
  
    return Math.round(overallProgress);
  };
