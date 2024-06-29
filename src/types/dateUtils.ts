export function formatDate(value: Date): string {
  if (!value) return '';

  const date = new Date(value);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

export function formatDateToMMDDYYYY(date: Date): string {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
}

export function parseDateFromMMDDYYYY(dateString: string): Date {
  const [month, day, year] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}