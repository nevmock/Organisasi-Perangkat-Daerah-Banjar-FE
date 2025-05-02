export function formatWeekLabel(weekString) {
  // Validasi format input
  const match = weekString.match(/^(\d{4})-W(\d{2})$/);
  if (!match) return "Format tidak valid";

  const [, year, week] = match;
  return `Pekan ${parseInt(week, 10)}, ${year}`;
}
