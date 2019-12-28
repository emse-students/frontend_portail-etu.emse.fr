export const getLastMonday = (currentDate: Date = null): Date => {
  // eslint-disable-next-line no-param-reassign
  currentDate = currentDate ? new Date(currentDate) : new Date();
  const offsetDay = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1;
  const lastmonday = new Date(currentDate.setDate(currentDate.getDate() - offsetDay));
  lastmonday.setHours(0);
  lastmonday.setMinutes(0);
  lastmonday.setSeconds(0);
  lastmonday.setMilliseconds(0);
  return lastmonday;
};

export const getNextDay = (currentDate: Date = null): Date => {
  // eslint-disable-next-line no-param-reassign
  currentDate = currentDate ? new Date(currentDate) : new Date();
  return new Date(currentDate.setDate(currentDate.getDate() + 1));
};

export const getCalendarEndDate = (currentDate: Date = null): Date => {
  // eslint-disable-next-line no-param-reassign
  currentDate = currentDate ? new Date(currentDate) : new Date();
  const offsetDay = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1;
  const endDate = new Date(currentDate.setDate(currentDate.getDate() + 4 * 7 - offsetDay));
  endDate.setHours(0);
  endDate.setMinutes(0);
  endDate.setSeconds(0);
  endDate.setMilliseconds(0);
  return endDate;
};
