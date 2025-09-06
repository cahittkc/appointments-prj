import { format, differenceInDays, differenceInHours, differenceInMinutes, isPast } from 'date-fns';

export const formatDateToFullDate = (date: string) => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm');
};

export const getTimeRemaining = (is_cancelled: boolean | undefined, date: string) => {
  if (is_cancelled) return '';
  
  const appointmentDate = new Date(date);
  const now = new Date();
  
  const years = Math.floor(differenceInDays(appointmentDate, now) / 365);
  const months = Math.floor(differenceInDays(appointmentDate, now) / 30);
  const days = differenceInDays(appointmentDate, now);
  const hours = differenceInHours(appointmentDate, now);
  const minutes = differenceInMinutes(appointmentDate, now);
  
  if (years > 0) return `${years} years`;
  if (months > 0) return `${months} months`;
  if (days > 0) return `${days} days`;
  if (hours > 0) return `${hours} hours`;
  return `${minutes} min`;
};

export const appointmentStatus = (is_cancelled: boolean | undefined, date: string) => {
  if (is_cancelled) return 'Cancelled';
  if (isPast(new Date(date))) return 'Completed';
  return 'Upcoming';
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Cancelled':
      return 'text-red-500';
    case 'Completed':
      return 'text-green-500';
    case 'Upcoming':
      return 'text-yellow-500';
    default:
      return 'text-gray-500';
  }
};