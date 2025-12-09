![npm](https://img.shields.io/npm/v/jalaali-ts)
![CI](https://github.com/h-luhrasbe/jalaali-ts/actions/workflows/ci.yml/badge.svg)
![npm downloads](https://img.shields.io/npm/dm/jalaali-ts)
![license](https://img.shields.io/github/license/H-Luhrasbe/jalaali-ts)

# jalaali-ts

A strict, clean TypeScript port of the original [`jalaali-js`](https://github.com/jalaali/jalaali-js) library, providing accurate conversion between **Jalaali (Persian)** and **Gregorian** calendar dates with modern module support. Based on the original MIT-licensed [`jalaali-js`](https://github.com/jalaali/jalaali-js) algorithm.

This project preserves the original algorithm (MIT-licensed) while providing:

- ✔ Fully typed TypeScript API
- ✔ Modern ESM + CJS builds
- ✔ Zero dependencies
- ✔ Tree‑shakeable design
- ✔ Identical behavior to the original [`jalaali-js`](https://github.com/jalaali/jalaali-js) algorithms

---

## ✨ Features

- Convert Gregorian dates to Jalaali
- Convert Jalaali dates to Gregorian
- Determine whether a Jalaali year is a leap year
- Calculate the number of days in a Jalaali month
- Get the start and end dates of a Jalaali week
- Completely rewritten in modern TypeScript
- Compatible with Angular, Vite, Webpack, Bun, Node, Deno

---

## 📦 Installation

```bash
npm install jalaali-ts
```

(or yarn / pnpm / bun)

---

## 🔧 Usage

### Basic Conversion

```ts
import { toJalaali, toGregorian, isLeapJalaaliYear } from "jalaali-ts";

// Gregorian → Jalaali
const jDate = toJalaali(2025, 2, 14);
console.log(jDate);
// { jy: 1403, jm: 11, jd: 25 }

// Jalaali → Gregorian
const gDate = toGregorian(jDate.jy, jDate.jm, jDate.jd);
console.log(gDate);
// { gy: 2025, gm: 2, gd: 14 }

// Check leap year
console.log(isLeapJalaaliYear(1403)); // true or false
```

### Full Round-Trip Example

```ts
import { toJalaali, toGregorian } from "jalaali-ts";

const gDate = { gy: 2025, gm: 2, gd: 14 };
const jDate = toJalaali(gDate.gy, gDate.gm, gDate.gd);
console.log(jDate); // { jy: 1403, jm: 11, jd: 25 }

const gBack = toGregorian(jDate.jy, jDate.jm, jDate.jd);
console.log(gBack); // { gy: 2025, gm: 2, gd: 14 }
```

### 🔗 API

- `toJalaali(gy, gm, gd)` → Converts Gregorian → Jalaali
- `toGregorian(jy, jm, jd)` → Converts Jalaali → Gregorian
- `isValidJalaaliDate(jy, jm, jd)` → `boolean`
- `isLeapJalaaliYear(jy)` → `boolean`
- `jalaaliMonthLength(jy, jm)` → number of days
- `jalCal(jy)` → leap info & March day
- `j2d(jy, jm, jd)` → Julian day number
- `d2j(jdn)` → Jalaali date from Julian day
- `g2d(gy, gm, gd)` → Julian day from Gregorian
- `d2g(jdn)` → Gregorian date from Julian day
- `jalaaliToDateObject(jy, jm, jd, h?, m?, s?, ms?)` → JS `Date` object
- `jalaaliWeek(jy, jm, jd)` → start/end of week

---

## 📝 License

This project is licensed under the **MIT License**, and contains portions based on the original [`jalaali-js`](https://github.com/jalaali/jalaali-js) (MIT).  
See the `LICENSE` file for details.
