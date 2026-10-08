// Release notes shown behind the menu's "📣 News!" button. Newest first.
// Add an entry here with each release; `date` is YYYY-MM-DD.
export type NewsItem = { date: string; message: string };

export const NEWS: NewsItem[] = [
  { date: '2026-10-08', message: 'New Teach Me mode — a Medium board with hints to learn the logic' },
  { date: '2026-10-08', message: 'Puzzles never need a guess — always solvable by logic' },
  { date: '2026-10-08', message: 'Daily streaks now show on the leaderboard' },
  { date: '2026-10-08', message: "Today's Top 10 (was Top 5)" },
  { date: '2026-09-29', message: 'Personal Stats (stored on your phone only)' },
  { date: '2026-09-29', message: 'Reward feature!' },
  { date: '2026-09-29', message: 'New Pause feature added' },
  { date: '2026-09-29', message: 'Daily now counts your tries' },
];
