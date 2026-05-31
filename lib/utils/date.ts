const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

function toJstDate(date: Date): Date {
  return new Date(date.getTime() + JST_OFFSET_MS);
}

function fromJstParts(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day) - JST_OFFSET_MS);
}

export function formatDateKey(date: Date): string {
  const jst = toJstDate(date);
  const year = jst.getUTCFullYear();
  const month = String(jst.getUTCMonth() + 1).padStart(2, "0");
  const day = String(jst.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayKey(): string {
  return formatDateKey(new Date());
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return fromJstParts(year, month, day);
}

export function formatDisplayDate(dateKey: string): string {
  const date = parseDateKey(dateKey);
  const jst = toJstDate(date);
  const month = jst.getUTCMonth() + 1;
  const day = jst.getUTCDate();
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const weekday = weekdays[jst.getUTCDay()];
  return `${month}月${day}日（${weekday}）`;
}

export function formatShortDate(dateKey: string): string {
  const date = parseDateKey(dateKey);
  const jst = toJstDate(date);
  return `${jst.getUTCMonth() + 1}/${jst.getUTCDate()}`;
}

export function isFutureDate(dateKey: string): boolean {
  return dateKey > getTodayKey();
}

export function getMonthDays(year: number, month: number): string[] {
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  });
}

export function getMonthStartKey(dateKey: string): string {
  const [year, month] = dateKey.split("-");
  return `${year}-${month}-01`;
}

export function addMonths(dateKey: string, delta: number): string {
  const date = parseDateKey(dateKey);
  const jst = toJstDate(date);
  const year = jst.getUTCFullYear();
  const month = jst.getUTCMonth() + delta;
  const newDate = new Date(Date.UTC(year, month, 1));
  return formatDateKey(fromJstParts(newDate.getUTCFullYear(), newDate.getUTCMonth() + 1, 1));
}

export function getDaysAgoKey(days: number): string {
  const today = parseDateKey(getTodayKey());
  const target = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
  return formatDateKey(target);
}

export function addDays(dateKey: string, delta: number): string {
  const date = parseDateKey(dateKey);
  const target = new Date(date.getTime() + delta * 24 * 60 * 60 * 1000);
  return formatDateKey(target);
}
