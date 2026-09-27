# Idea: emoji board in the Share message

Status: for Rob's review, no code changed. Generated 2026-09-27 from the real
`puzzle.ts` (same seed the app uses), so the first block is literally today's daily.

Wordle shares emoji squares, not ASCII, so this does the same: one emoji per
cell, coloured by region, unsolved. The only cat shown is the prefilled one on
easy boards, which the player already sees before solving.

## Proposed message (today, Sep 27, easy 6x6)

```
ZouZou Daily - Sep/27
Easy Puzzle
Solve Time: 1:23

🟧🟧🟧🟧🟥🐱
🟧🟧🟧🟥🟥🟥
🟧🟧🟧🟥🟨🟥
🟩🟩🟩🟩🟨🟨
🟦🟦🟦🟩🟨🟨
🟦🟦🟦🟪🟨🟨
```

Your three lines unchanged, blank line, then the board. 6 lines of 6 emoji.
Length ~190 chars; a 10x10 board is ~460 chars. Fine for iMessage / SMS.

## Palette question

Only 9 square emoji exist: 🟥 🟧 🟨 🟩 🟦 🟪 🟫 ⬛ ⬜. Hard boards have 10
regions, so region 10 needs a stand-in. Two options:

**A. Squares, 🔲 as the tenth** (used above and below)
**B. Circles**: 🔴 🟠 🟡 🟢 🔵 🟣 🟤 ⚫ ⚪ 🔘 — ten exist, but circles read less
like a grid and the 🔘 radio button is odd.

Recommend A. The tenth region only ever appears on hard days.

Emoji can't match the app's palette exactly (no pink, no lime, no teal square).
Mapping is "region number → emoji", not colour-for-colour. Same region is
always the same emoji, which is all the picture needs.

## Same board, circles (B)

```
🟠🟠🟠🟠🔴🐱
🟠🟠🟠🔴🔴🔴
🟠🟠🟠🔴🟡🔴
🟢🟢🟢🟢🟡🟡
🔵🔵🔵🟢🟡🟡
🔵🔵🔵🟣🟡🟡
```

## Samples of the other sizes (squares)

Medium 8x8:

```
🟥🟥🟥🟧🟧🟧🟧🟧
🟥🟨🟥⬛⬛⬛🟩🟧
🟥🟨⬛⬛🟩🟩🟩🟧
🟫⬛⬛🟦🟩🟩🟩🟧
🟫⬛🟦🟦🟦🟦🟪🟪
🟫⬛⬛⬛🟦🟦🟪🟪
🟫🟫⬛⬛🟦⬛⬛🟪
🟫🟫🟫⬛⬛⬛⬛🟪
```

Hard 10x10:

```
🟧🟧🟧🟧🟧🟧🟥🟥🟥🟥
🟦🟧🟧🟧🔲🔲🔲🔲🟥🟥
🟦🟧🟧🟧🟧🔲🟩🟨🟨🟨
🟦🟧🟧🟧🔲🔲🟩🟨🟨🔲
🟦🟦🟦🟧🔲🟩🟩🟨🟨🔲
🟪🟦🟦🟦🔲🟩🟩🔲🔲🔲
🟪🟪🟪🟦🔲🔲🔲🔲🟫🔲
⬜⬜🟪🟪⬛🟫🟫🟫🟫🔲
⬜⬜⬜⬛⬛⬛⬛⬛🟫🔲
🔲🔲🔲🔲🔲🔲🔲🔲🔲🔲
```

## Things to decide

1. Squares (A) or circles (B)?
2. Show the prefilled cat as 🐱, or hide it and show its region colour? It is
   visible to every player before they start, so it gives nothing away.
3. Board after the three lines (Wordle puts the grid after the header line) or
   between the date line and the time line?
4. Add a link line at the end, e.g. `zouzou.minus1over12.com`? Wordle doesn't,
   but friends who don't have the link would need it.

## Implementation note (when approved)

~15 lines in `DailyResults.tsx`: regenerate today's puzzle with
`generatePuzzle(size, getDailySeed(), prefill)` (deterministic, same as Game),
map `regionMap` through the palette, join rows with `\n`. No store change, no
server change. Dark mode irrelevant, emoji render the same everywhere.
