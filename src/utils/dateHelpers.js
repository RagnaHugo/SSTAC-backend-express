/**
 * Utilidades para manejo de fechas en SSTAC
 */

const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
};

const calculateDaysDifference = (startDate, endDate) => {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  return checkDate.toDateString() === today.toDateString();
};

const isWithinLastDays = (date, days) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  return new Date(date) >= cutoffDate;
};

module.exports = {
  formatDate,
  calculateDaysDifference,
  addDays,
  isToday,
  isWithinLastDays
};