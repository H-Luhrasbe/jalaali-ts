import { describe, it, expect } from 'vitest';
import {
  toJalaali,
  toGregorian,
  isValidJalaaliDate,
  isLeapJalaaliYear,
  jalaaliMonthLength,
  jalaaliToDateObject,
  jalaaliWeek,
  type JalaaliDate,
  type GregorianDate,
} from '../src';

describe('jalaali-ts library', () => {
  it('should convert Gregorian to Jalaali correctly', () => {
    const j: JalaaliDate = toJalaali(2025, 11, 15);
    expect(j).toHaveProperty('jy');
    expect(j).toHaveProperty('jm');
    expect(j).toHaveProperty('jd');
  });

  it('should accept a Date object for conversion', () => {
    const date = new Date(2025, 10, 15); // Note: month 0-indexed
    const j = toJalaali(date);
    expect(j.jy).toBeGreaterThan(0);
    expect(j.jm).toBeGreaterThan(0);
    expect(j.jd).toBeGreaterThan(0);
  });

  it('should convert Jalaali to Gregorian correctly', () => {
    const g: GregorianDate = toGregorian(1404, 8, 24);
    expect(g).toHaveProperty('gy');
    expect(g).toHaveProperty('gm');
    expect(g).toHaveProperty('gd');
  });

  it('should detect valid Jalaali dates', () => {
    expect(isValidJalaaliDate(1404, 8, 24)).toBe(true);
    expect(isValidJalaaliDate(1404, 13, 1)).toBe(false);
    expect(isValidJalaaliDate(5000, 1, 1)).toBe(false);
  });

  it('should detect leap Jalaali years', () => {
    expect(isLeapJalaaliYear(1404)).toBe(false);
    expect(isLeapJalaaliYear(1403)).toBe(true);
  });

  it('should calculate the correct month length', () => {
    expect(jalaaliMonthLength(1404, 1)).toBe(31);
    expect(jalaaliMonthLength(1404, 7)).toBe(30);
    expect(jalaaliMonthLength(1403, 12)).toBe(30); // leap year
  });

  it('jalaaliToDateObject should return a valid Date', () => {
    const dateObj = jalaaliToDateObject(1404, 8, 24, 12, 30, 15);
    expect(dateObj).toBeInstanceOf(Date);
    expect(dateObj.getHours()).toBe(12);
    expect(dateObj.getMinutes()).toBe(30);
    expect(dateObj.getSeconds()).toBe(15);
  });

  it('jalaaliWeek should return Saturday and Friday', () => {
    const week = jalaaliWeek(1404, 8, 24);
    expect(week).toHaveProperty('saturday');
    expect(week).toHaveProperty('friday');
    expect(week.saturday).toHaveProperty('jy');
    expect(week.friday).toHaveProperty('jy');
  });

  it('should be reversible between Gregorian and Jalaali', () => {
    const g: GregorianDate = { gy: 2025, gm: 11, gd: 15 };
    const j: JalaaliDate = toJalaali(g.gy, g.gm, g.gd);
    const g2: GregorianDate = toGregorian(j.jy, j.jm, j.jd);

    expect(g2.gy).toBe(g.gy);
    expect(g2.gm).toBe(g.gm);
    expect(g2.gd).toBe(g.gd);
  });
});
