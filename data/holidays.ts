// Keys are "MM-DD" for recurring annual holidays
// and "YYYY-MM-DD" for one-time holidays
export const HOLIDAYS: Record<string, string> = {
  // ── Indian National Holidays ──────────────────────────
  "01-26": "Republic Day",
  "08-15": "Independence Day",
  "10-02": "Gandhi Jayanti",

  // ── Indian Festival Holidays (approximate fixed dates) ─
  "01-14": "Makar Sankranti",
  "01-15": "Pongal",
  "03-25": "Holi",
  "04-14": "Dr. Ambedkar Jayanti",
  "04-17": "Ram Navami",
  "08-19": "Raksha Bandhan",
  "08-26": "Janmashtami",
  "10-12": "Dussehra",
  "10-31": "Halloween / Sardar Patel Jayanti",
  "11-01": "Diwali",
  "11-15": "Guru Nanak Jayanti",
  "12-25": "Christmas",

  // ── International Days ────────────────────────────────
  "01-01": "New Year's Day",
  "02-14": "Valentine's Day",
  "03-08": "International Women's Day",
  "04-22": "Earth Day",
  "05-01": "Labour Day",
  "06-05": "World Environment Day",
  "06-21": "World Music Day",
  "10-16": "World Food Day",
  "11-14": "Children's Day",
};

export function getHolidayName(date: Date): string | null {
  const mmdd = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

  const yyyy = date.getFullYear();
  const yyyymmdd = `${yyyy}-${mmdd}`;

  return HOLIDAYS[yyyymmdd] ?? HOLIDAYS[mmdd] ?? null;
}

export function isHoliday(date: Date): boolean {
  return getHolidayName(date) !== null;
}