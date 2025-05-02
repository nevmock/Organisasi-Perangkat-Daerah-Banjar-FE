export function getISOWeek(isoDateString) {
  const date = new Date(isoDateString);

  // Copy date to avoid modifying the original
  const tempDate = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );

  // Get Thursday of this week
  const day = tempDate.getUTCDay();
  const diff = day <= 4 ? 4 - day : 11 - day;
  tempDate.setUTCDate(tempDate.getUTCDate() + diff);

  // First Thursday of the year
  const firstThursday = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
  const firstDay = firstThursday.getUTCDay();
  const firstThursdayOffset = firstDay <= 4 ? 4 - firstDay : 11 - firstDay;
  firstThursday.setUTCDate(firstThursday.getUTCDate() + firstThursdayOffset);

  // Calculate week number
  const weekNo = Math.ceil(
    ((tempDate.getTime() - firstThursday.getTime()) / 86400000 + 1) / 7
  );

  const year = tempDate.getUTCFullYear();
  const weekStr = weekNo < 10 ? `0${weekNo}` : weekNo;

  return `${year}-W${weekStr}`;
}
