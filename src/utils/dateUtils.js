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
