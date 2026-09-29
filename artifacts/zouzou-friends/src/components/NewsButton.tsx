import { useState } from 'react';
import { ActionButton, Modal } from './ui';
import { NEWS } from '../lib/news';
import { formatDailyDate } from '../lib/puzzle';

// Per-browser "seen" marker for the unread dot. localStorage can throw (private
// mode, blocked site data), so every access is guarded; worst case the dot shows.
const seenKey = 'zouzou-news-seen';

function readSeen(): string | null {
  try {
    return window.localStorage.getItem(seenKey);
  } catch {
    return null;
  }
}

function writeSeen(date: string): void {
  try {
    window.localStorage.setItem(seenKey, date);
  } catch {
    // Ignore: the dot just comes back next visit.
  }
}

export function NewsButton() {
  const latest = NEWS[0]?.date ?? null;
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(() => {
    if (!latest) return false;
    const seen = readSeen();
    return seen === null || seen < latest;
  });

  if (!latest) return null;

  const open = () => {
    setIsOpen(true);
    setHasUnread(false);
    writeSeen(latest);
  };

  return (
    <>
      <button
        onClick={open}
        className="relative px-3 py-1 rounded-full border-2 border-board/20 bg-white font-bold text-sm text-board hover:bg-black/5 transition-colors"
        aria-label={hasUnread ? 'News (unread)' : 'News'}
      >
        📣 News!
        {hasUnread && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#D6453A] border-2 border-white" />
        )}
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="📣 News">
        <ul className="space-y-3 text-left mb-6">
          {NEWS.map((item) => (
            <li key={`${item.date}-${item.message}`} className="flex gap-3 items-baseline">
              <span className="text-xs font-black uppercase tracking-wider text-board/45 shrink-0">
                {formatDailyDate(item.date)}
              </span>
              <span className="font-bold text-board">{item.message}</span>
            </li>
          ))}
        </ul>
        <ActionButton variant="ghost" className="w-full" onClick={() => setIsOpen(false)}>
          Close
        </ActionButton>
      </Modal>
    </>
  );
}
