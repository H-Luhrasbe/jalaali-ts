export {
  toJalaali,
  toGregorian,
  isValidJalaaliDate,
  isLeapJalaaliYear,
  jalaaliMonthLength,
  jalCal,
  j2d,
  d2j,
  g2d,
  d2g,
  jalaaliToDateObject,
  jalaaliWeek,
};

/* ------------- Type Definitions ------------- */

/**
 * Represents a Jalaali (Persian) date.
 */
export interface JalaaliDate {
  /** Year in Jalaali calendar (1 to 3100) */
  jy: number;
  /** Month in Jalaali calendar (1–12) */
  jm: number;
  /** Day in Jalaali calendar (1 to 29/31) */
  jd: number;
}

/**
 * Represents a Gregorian date.
 */
export interface GregorianDate {
  /**
   * Gregorian year (years BC numbered 0, -1, -2, ...)
   */
  gy: number;
  /**
   * Gregorian month (1–12)
   */
  gm: number; //
  /**
   * Gregorian day of the month M (1 to 28/29/30/31)
   */
  gd: number;
}

/**
 * Result returned by jalCal function.
 */
export interface JalCalResult {
  /** Leap years since the last leap year (0–4) */
  leap: number;
  /** Gregorian year corresponding to the start of the Jalaali year */
  gy: number;
  /** Day in March of the first day of the Jalaali year */
  march: number;
}

/**
 * Represents the start and end of a Jalaali week.
 */
export interface JalaaliWeek {
  /** Saturday of the week (week starts on Saturday) */
  saturday: JalaaliDate;
  /** Friday of the week */
  friday: JalaaliDate;
}

/* ------------- Constants ------------- */

/**
 * Jalaali calendar break points used for leap year calculations.
 *
 * These values define years at which the 33-year leap-year cycle is adjusted.
 * The algorithm relies on these break points to compute the leap year positions
 * and the day of Farvardin 1 (the first day of the Jalaali year) in the Gregorian calendar.
 *
 * @see https://github.com/jalaali/jalaali-js
 *
 * @example
 * // Accessing the first break
 * const firstBreak = breaks[0]; // -61
 */
const breaks: number[] = [
  -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394,
  2456, 3178,
];

/* ------------- Public Functions ------------- */

/**
 * Converts a Gregorian date to a Jalaali date.
 * @param gy Gregorian year or a Date object
 * @param gm Gregorian month (1–12)
 * @param gd Gregorian day
 * @returns Jalaali date object
 *
 * @example
 * ```ts
 * const jDate = toJalaali(2025, 11, 15);
 * console.log(jDate); // { jy: 1404, jm: 8, jd: 24 }
 *
 * // Using a Date object
 * const jDate2 = toJalaali(new Date(2025, 10, 15)); // Month is 0-indexed
 * ```
 */
function toJalaali(gy: number | Date, gm?: number, gd?: number): JalaaliDate {
  if (gy instanceof Date) {
    gd = gy.getDate();
    gm = gy.getMonth() + 1;
    gy = gy.getFullYear();
  } else if (!gm || !gd) throw new Error('Gregorian Month and Gregorian Day are required');

  return d2j(g2d(gy, gm, gd));
}

/**
 * Converts a Jalaali date to a Gregorian date.
 * @param jy Jalaali year
 * @param jm Jalaali month (1–12)
 * @param jd Jalaali day
 * @returns Gregorian date object
 *
 * @example
 * ```ts
 * const gDate = toGregorian(1404, 8, 24);
 * console.log(gDate); // { gy: 2025, gm: 11, gd: 15 }
 * ```
 */
function toGregorian(jy: number, jm: number, jd: number): GregorianDate {
  return d2g(j2d(jy, jm, jd));
}

/**
 * Checks if a given Jalaali date is valid.
 * @param jy Jalaali year
 * @param jm Jalaali month (1–12)
 * @param jd Jalaali day
 * @returns true if the date is valid, false otherwise
 */
function isValidJalaaliDate(jy: number, jm: number, jd: number): boolean {
  return (
    jy >= -61 && jy <= 3177 && jm >= 1 && jm <= 12 && jd >= 1 && jd <= jalaaliMonthLength(jy, jm)
  );
}

/**
 * Checks if a Jalaali year is a leap year.
 * @param jy Jalaali year
 * @returns true if leap year, false otherwise
 */
function isLeapJalaaliYear(jy: number): boolean {
  return jalCalLeap(jy) === 0;
}

/**
 * Returns the number of days in a Jalaali month.
 * @param jy Jalaali year
 * @param jm Jalaali month (1–12)
 * @returns Number of days
 */
function jalaaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  if (isLeapJalaaliYear(jy)) return 30;
  return 29;
}

/**
 * This function determines if the Jalaali (Persian) year is
 *   leap (366-day long) or is the common year (365 days), and
 *   finds the day in March (Gregorian calendar) of the first
 *   day of the Jalaali year (jy).
 * @param jy Jalaali year (-61 to 3177)
 * @param withoutLeap Optional flag to skip leap calculation
 * @returns Object with:</br>
 *     leap: number of years since the last leap year (0 to 4)</br>
 *     gy: Gregorian year of the beginning of Jalaali year</br>
 *     march: the March day of Farvardin the 1st (1st day of jy)
 *
 * @see: http://www.astro.uni.torun.pl/~kb/Papers/EMP/PersianC-EMP.htm
 * @see: http://www.fourmilab.ch/documents/calendar/
 *
 * @example
 * jalCal(1404); // { leap: 3, gy: 2025, march: 20 }
 */
function jalCal(jy: number, withoutLeap?: boolean): JalCalResult {
  if (!breaks || breaks.length === 0) throw new Error('breaks array cannot be empty');

  const bl = breaks.length;
  const gy = jy + 621;
  let leapJ = -14;

  let jp = breaks[0] as number;

  if (jy < jp || jy >= (breaks[bl - 1] as number)) throw new Error('Invalid Jalaali year ' + jy);

  let jump = 0;
  let jm: number;

  // Find the limiting years for the Jalaali year jy.
  for (let i = 1; i < bl; i++) {
    jm = breaks[i] as number;
    jump = jm - jp;
    if (jy < jm) break;
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }

  let n = jy - jp;

  /*
  Find the number of leap years from AD 621 to the beginning
  of the current Jalaali year in the Persian calendar.
   */
  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;

  // And the same in the Gregorian calendar (until the year gy).
  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;

  // Determine the Gregorian date of Farvardin the 1st.
  const march = 20 + leapJ - leapG;

  // return with gy and march when we don't need leap
  if (withoutLeap === true) return { gy, march } as JalCalResult;

  // Find how many years have passed since the last leap year.
  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;

  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;

  return { leap, gy, march };
}

/**
 * Converts a Jalaali date to Julian Day Number (JDN).
 * @param jy Jalaali year (1 to 3100)
 * @param jm Jalaali month (1–12)
 * @param jd Jalaali day (1 to 29/31)
 * @returns Julian Day Number
 *
 * @example
 * j2d(1404, 8, 24); // 2464499
 */
function j2d(jy: number, jm: number, jd: number): number {
  const r = jalCal(jy, true);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

/**
 * Converts Julian Day Number to Jalaali date.
 * @param jdn Julian Day Number
 * @returns Jalaali date
 *
 * @example
 * d2j(2464499); // { jy: 1404, jm: 8, jd: 24 }
 */
function d2j(jdn: number): JalaaliDate {
  const gy = d2g(jdn).gy;
  let jy = gy - 621;
  const r = jalCal(jy, false);
  const jdn1f = g2d(gy, 3, r.march);
  let jm: number, jd: number;

  // Find number of days that passed since 1 Farvardin.
  let k = jdn - jdn1f;
  if (k >= 0) {
    if (k <= 185) {
      // The first 6 months.
      jm = 1 + div(k, 31);
      jd = mod(k, 31) + 1;
      return { jy, jm, jd };
    } else {
      // The remaining months.
      k -= 186;
    }
  } else {
    // Previous Jalaali year.
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }

  jm = 7 + div(k, 30);
  jd = mod(k, 30) + 1;
  return { jy, jm, jd };
}

/**
 * Calculates the Julian Day number from Gregorian or Julian
 * calendar dates. This integer number corresponds to the noon of
 * the date (i.e. 12 hours of Universal Time).
 * The procedure was tested to be good since 1 March, -100100 (of both
 * calendars) up to a few million years into the future.
 *
 * @param gy Gregorian year (years BC numbered 0, -1, -2, ...)
 * @param gm Gregorian month (1–12)
 * @param gd Gregorian day of the month (1 to 28/29/30/31)
 * @returns Julian Day Number
 *
 * @example
 * g2d(2025, 11, 15); // 2464499
 */
function g2d(gy: number, gm: number, gd: number): number {
  let d =
    div((gy + div(gm - 8, 6) + 100_100) * 1461, 4) +
    div(153 * mod(gm + 9, 12) + 2, 5) +
    gd -
    34_840_408;
  d = d - div(div(gy + 100_100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

/**
 * Calculates Gregorian and Julian calendar dates from the Julian Day number
 * (jdn) for the period since jdn=-34839655 (i.e. the year -100100 of both
 * calendars) to some millions years ahead of the present.
 *
 * @param jdn Julian Day Number
 * @returns Gregorian date
 *
 * @example
 * d2g(2464499); // { gy: 2025, gm: 11, gd: 15 }
 */
function d2g(jdn: number): GregorianDate {
  let j = 4 * jdn + 139_361_631;
  j = j + div(div(4 * jdn + 183_187_720, 146_097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100_100 + div(8 - gm, 6);
  return { gy, gm, gd };
}

/**
 * Converts Jalaali date to JavaScript Date object.
 * @param jy Jalaali year
 * @param jm Jalaali month (1–12)
 * @param jd Jalaali day
 * @param h Hours (optional)
 * @param m Minutes (optional)
 * @param s Seconds (optional)
 * @param ms Milliseconds (optional)
 * @returns JavaScript Date object
 *
 * @example
 * ```ts
 * const dateObj = jalaaliToDateObject(1404, 8, 24, 12, 30, 15);
 * console.log(dateObj.toISOString());
 * ```
 */
function jalaaliToDateObject(
  jy: number,
  jm: number,
  jd: number,
  h?: number,
  m?: number,
  s?: number,
  ms?: number,
): Date {
  const g = toGregorian(jy, jm, jd);
  return new Date(g.gy, g.gm - 1, g.gd, h ?? 0, m ?? 0, s ?? 0, ms ?? 0);
}

/**
 * Returns the Saturday and Friday of a given Jalaali week.
 * Week starts on Saturday.
 * @param jy Jalaali year
 * @param jm Jalaali month
 * @param jd Jalaali day
 */
function jalaaliWeek(jy: number, jm: number, jd: number): JalaaliWeek {
  const dayOfWeek = jalaaliToDateObject(jy, jm, jd).getDay();
  const startDayDifference = dayOfWeek === 6 ? 0 : -(dayOfWeek + 1);
  const endDayDifference = 6 + startDayDifference;
  return {
    saturday: d2j(j2d(jy, jm, jd + startDayDifference)),
    friday: d2j(j2d(jy, jm, jd + endDayDifference)),
  };
}

/* ============================================================
   Jalaali Date Library (TypeScript)
   Internal helper functions
   ============================================================ */

/**
 * Integer division helper.
 * @param a Dividend
 * @param b Divisor
 * @returns Integer result of a / b
 *
 * @example
 * div(7, 3); // 2
 */
function div(a: number, b: number): number {
  return ~~(a / b);
}

/**
 * Modulus helper.
 * @param a Dividend
 * @param b Divisor
 * @returns Remainder of a / b
 *
 * @example
 * mod(7, 3); // 1
 */
function mod(a: number, b: number): number {
  return a - ~~(a / b) * b;
}

/**
 * This function determines if the Jalaali (Persian) year is leap (366-day long) or is the common year (365 days)
 * @param jy Jalaali year (-61 to 3177)
 * @returns number of years since the last leap year (0 to 4)
 *
 * @example
 * jalCalLeap(1404); // 3
 */
function jalCalLeap(jy: number): number {
  if (!breaks || breaks.length === 0) throw new Error('breaks array cannot be empty');

  const bl = breaks.length;
  let jp = breaks[0] as number;

  if (jy < jp || jy >= (breaks[bl - 1] as number)) throw new Error('Invalid Jalaali year ' + jy);

  let jm: number;
  let jump = 0;
  for (let i = 1; i < bl; i++) {
    jm = breaks[i] as number;
    jump = jm - jp;
    if (jy < jm) break;
    jp = jm;
  }

  let n = jy - jp;

  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;

  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;

  return leap;
}
