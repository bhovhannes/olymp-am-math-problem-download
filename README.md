# Olymp Problem Downloader

Downloads Armenian Math Olympiad problems from olymp.am.

## Usage

```bash
node download-problems.js [CLASS] [MIN_YEAR] [MAX_YEAR]
```

## Parameters

- `CLASS`: The class/grade level (default: 6)
- `MIN_YEAR`: Starting year (default: 2020)
- `MAX_YEAR`: Ending year (default: 2025)

## Examples

Download all problems for class 6 from 2020 to 2025:
```bash
node download-problems.js 6 2020 2025
```

Download problems for class 8 from 2022 to 2024:
```bash
node download-problems.js 8 2022 2024
```

Download with default parameters (class 6, 2020-2025):
```bash
node download-problems.js
```

## Output

Files are organized in the following structure:

```
problems-<CLASS>/
├── school/
│   ├── Ar-Math-<CLASS>das-<YEAR>.pdf
│   └── Solutions-Math-<CLASS>das-<YEAR>-1.pdf
└── region/
    ├── Ar-Math-<CLASS>das-<YEAR>-MP.pdf
    └── Solutions-Math-<CLASS>das-<YEAR>MP-1.pdf
```

For example, class 6 problems will be saved to:
- `problems-6/school/` - School-level problems and solutions
- `problems-6/region/` - Regional (MP) problems and solutions

