export default function getWeekFromDate(dateString) {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();

  // Ambil tanggal pertama dalam tahun
  const firstDayOfYear = new Date(Date.UTC(year, 0, 1));
  const pastDaysOfYear = Math.floor((date - firstDayOfYear) / 86400000);

  // Hitung pekan ke berapa (dengan asumsi pekan dimulai Senin)
  const weekNumber = Math.ceil(
    (pastDaysOfYear + firstDayOfYear.getUTCDay() + 1) / 7
  );

  return `Pekan ${weekNumber}, ${year}`;
}

// Contoh pemakaian:
const hasil = getWeekFromDate("2025-07-01T00:00:00.000Z");
console.log(hasil); // Pekan ke-27, Tahun 2025
