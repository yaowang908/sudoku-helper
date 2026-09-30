# Sudoku Helper

<img width="1061" height="730" alt="CleanShot 2026-07-29 at 23 13 00" src="https://github.com/user-attachments/assets/b734259e-72f5-423a-b42b-23e35cea0268" />


A modern Sudoku app that does the tedious part for you: as you place numbers,
it automatically tracks the remaining **candidate** values for every empty cell,
so you can focus on the actual solving.

Built with Next.js, TypeScript, Redux Toolkit and MUI.

## Features

- **Automatic candidate tracking** — each empty cell shows the values still
  possible for it; placing or erasing a number instantly updates its peers
  (row, column and 3×3 box).
- **Fill & Notes modes** — commit a value, or pencil in your own notes.
- **Conflict detection** — duplicate values in a row/column/box are highlighted.
- **Smart highlighting** — the selected cell, its peers, and all matching
  numbers are highlighted as you play.
- **Keyboard support** — arrow keys to move, `1`–`9` to enter, `Backspace`/`0`
  to erase.
- **Hide hints** for a classic, unassisted board (your own notes stay).
- **Timer, difficulty levels** (easy → expert), win celebration, and a
  **light / dark theme**.

## Development

```bash
yarn install
yarn dev      # start the dev server at http://localhost:3000
yarn build    # production build
```

## How the helper works

The board state lives in a Redux slice (`src/store`). Whenever a value is placed
or erased, `recomputeCrossedValues` derives each cell's eliminated values from
scratch based on the values currently on the board — a single source of truth
that keeps the candidate hints correct no matter how you got there.
