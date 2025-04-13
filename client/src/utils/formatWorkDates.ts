export function formatWorkDates(startDate: string, endDate: string): string {
  const cleanStart = startDate?.trim();
  const cleanEnd = endDate?.trim();

  const hasValidStart =
    !!cleanStart &&
    cleanStart.toLowerCase() !== 'null' &&
    cleanStart.toLowerCase() !== 'undefined';

  const hasValidEnd =
    !!cleanEnd &&
    cleanEnd.toLowerCase() !== 'null' &&
    cleanEnd.toLowerCase() !== 'undefined';

  if (hasValidStart && hasValidEnd) {
    return `${cleanStart} to ${cleanEnd}`;
  }

  if (hasValidStart && !hasValidEnd) {
    return `${cleanStart}`;
  }

  return 'N/A';
}
