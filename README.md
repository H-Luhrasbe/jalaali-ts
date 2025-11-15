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
- Completely rewritten in modern TypeScript  
- Compatible with Angular, Vite, Webpack, Bun, Node, Deno  

---

## 📦 Installation

```
npm install jalaali-ts
```

(or yarn / pnpm / bun)

---

## 🔧 Usage

```ts
import { toJalaali, toGregorian, isLeapJalaaliYear } from "jalaali-ts";

const result = toJalaali(2025, 2, 14);
console.log(result); 
// { jy: 1403, jm: 11, jd: 25 }
```

---

## 📝 License

This project is licensed under the **MIT License**, and contains portions based on the original jalaali-js (MIT).  
See the `LICENSE` file for details.
