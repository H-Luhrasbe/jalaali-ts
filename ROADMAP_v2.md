# jalaali-ts v2 Roadmap

Version 2 will focus on modernization, cleanup, and usability improvements without compromising correctness.

## Goals
### 1. Code Modernization
- Rewrite functions with cleaner logic
- Remove unnecessary complexity
- Prefer descriptive variable names
- Replace magic numbers with constants

### 2. Internal Restructure
- Group date conversion utilities logically
- Extract reusable helpers
- Add internal private functions where needed

### 3. Improved Types & Documentation
- Rewrite every function jsDoc in clear English
- Add examples for each public function
- Show expected input/output

### 4. Breaking API Improvements
- Rename confusing parameters (example: `jy`, `jm`, `jd`)
- Provide friendlier overloads

### 5. New Convenience Functions
Potential additions:
- `formatJalaali(date)`
- `parseJalaali(string)`
- `nowJalaali()`
- `addDays(date, n)`
- `compareJalaali(a, b)`

## Branch Strategy
- `v1-original` → stays API-compatible forever
- `v2` → main development branch for cleaner API
