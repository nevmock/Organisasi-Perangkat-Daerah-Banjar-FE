import weekToDate from "./weekToDate";

export default function getElapsedTimeFromWeek(weekStr) {
  const startDate = weekToDate(weekStr);
  console.log(startDate);
  const now = new Date();
  const diffMs = now.getTime() - startDate.getTime();

  if (diffMs < 0) return "Belum dimulai";

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

  return `${days} hari ${hours} jam ${minutes} menit`;
}
