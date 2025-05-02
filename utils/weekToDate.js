export default function weekToDate(weekStr) {
  const [yearStr, weekPart] = weekStr.split("-W");
  const year = parseInt(yearStr, 10);
  const week = parseInt(weekPart, 10);

  const jan4 = new Date(year, 0, 4); // 4 Januari
  const day = jan4.getDay(); // 0 = Minggu, 1 = Senin, dst
  const dayDiff = day <= 4 ? day - 1 : day - 8;
  const firstWeekStart = new Date(jan4);
  firstWeekStart.setDate(jan4.getDate() - dayDiff);

  const weekStart = new Date(firstWeekStart);
  weekStart.setDate(firstWeekStart.getDate() + (week - 1) * 7);

  return weekStart; // default ke Senin
}
