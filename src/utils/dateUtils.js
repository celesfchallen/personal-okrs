export const getCurrentQuarter = () => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const quarter = Math.floor(month / 3) + 1;
  return `Q${quarter} ${year}`;
};

const quarterToDate = (quarterString) => {
    const [q, year] = quarterString.split(' ');
    const month = (parseInt(q.substring(1)) - 1) * 3;
    return new Date(year, month);
}

export const getNextQuarter = (quarterString) => {
    const date = quarterToDate(quarterString);
    date.setMonth(date.getMonth() + 3);
    const month = date.getMonth();
    const year = date.getFullYear();
    const quarter = Math.floor(month / 3) + 1;
    return `Q${quarter} ${year}`;
}

export const getPreviousQuarter = (quarterString) => {
    const date = quarterToDate(quarterString);
    date.setMonth(date.getMonth() - 3);
    const month = date.getMonth();
    const year = date.getFullYear();
    const quarter = Math.floor(month / 3) + 1;
    return `Q${quarter} ${year}`;
}

export const getWeekDays = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  // Adjust to Monday as first day of week (day 0)
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
  const monday = new Date(d.setDate(diff));

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const weekDay = new Date(monday);
    weekDay.setDate(monday.getDate() + i);
    weekDays.push(weekDay);
  }
  return weekDays;
};

export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};
