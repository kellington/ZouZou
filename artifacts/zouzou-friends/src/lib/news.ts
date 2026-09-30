// Release notes shown behind the menu's "📣 News!" button. Newest first.
// Add an entry here with each release; `date` is YYYY-MM-DD.
export type NewsItem = { date: string; message: string };

export const NEWS: NewsItem[] = [
  { date: '2026-09-29', message: 'Reward feature!' },
  { date: '2026-09-29', message: 'New Pause feature added' },
  { date: '2026-09-29', message: 'Daily now counts your tries' },
];
