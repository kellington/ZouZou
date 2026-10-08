import { useEffect, useMemo, useState } from 'react';
import { Share2 } from 'lucide-react';
import { ActionButton, Modal } from './ui';
import { useStore, type ModeStats } from '../lib/store';
import {
  buildShareBoard,
  formatAttempts,
  formatDailyDate,
  formatTime,
  generatePuzzle,
  getDailyDifficulty,
  getDailySeed,
  getEdmontonDateKey,
  MODE_CONFIG,
  type Difficulty,
} from '../lib/puzzle';

interface DailyResultsProps {
  isOpen: boolean;
  onClose: () => void;
  heading: string;
  showBackToMenu?: boolean;
  onBackToMenu?: () => void;
}

const DIFFICULTY_ROWS: { key: Difficulty; label: string }[] = [
  { key: 'easy', label: 'Easy' },
  { key: 'medium', label: 'Medium' },
  { key: 'hard', label: 'Hard' },
];

// Minimum bar width (as a % of the row) so a 0 or low count is still visible,
// matching the Wordle stats screen.
const MIN_BAR_PERCENT = 12;

const SHARE_URL = 'https://zouzou.minus1over12.com';

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildShareText(params: {
  today: string;
  difficulty: Difficulty;
  seconds: number;
  attempts: number;
  boardText: string;
}): string {
  // attempts is 0 only for a win recorded before attempts were tracked.
  const attemptsSuffix = params.attempts > 0 ? ` (${formatAttempts(params.attempts)})` : '';
  return [
    `ZouZou Daily - ${formatDailyDate(params.today).replace('-', '/')}`,
    `${capitalize(params.difficulty)} Puzzle`,
    `Solve Time: ${formatTime(params.seconds)}${attemptsSuffix}`,
    '',
    params.boardText,
    '',
    SHARE_URL,
  ].join('\n');
}

function StatTile({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl font-black font-mono text-board">{value}</span>
      <span className="text-xs font-bold text-board/60">{label}</span>
    </div>
  );
}

export function DailyResults({
  isOpen,
  onClose,
  heading,
  showBackToMenu = false,
  onBackToMenu,
}: DailyResultsProps) {
  const { store } = useStore();
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  // Reset transient share feedback each time the modal closes, so reopening
  // it starts clean rather than showing a stale "Copied!" or fallback block.
  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
      setCopyFailed(false);
    }
  }, [isOpen]);

  const today = getEdmontonDateKey();
  const dailyDifficulty = getDailyDifficulty();
  const hasCompletedToday = store.lastDailyDate === today && store.daily !== null;

  const totalPlayed =
    store.stats.easy.played + store.stats.medium.played + store.stats.hard.played;
  const totalSolved =
    store.stats.easy.solved + store.stats.medium.solved + store.stats.hard.solved;
  const winPct = totalPlayed > 0 ? Math.round((100 * totalSolved) / totalPlayed) : 0;
  const maxPlayed = Math.max(
    store.stats.easy.played,
    store.stats.medium.played,
    store.stats.hard.played,
  );

  // Regenerated deterministically from today's seed, exactly as Game.tsx
  // builds the daily board, so the shared board matches what was played.
  const boardText = useMemo(() => {
    if (!hasCompletedToday) return '';
    const config = MODE_CONFIG[dailyDifficulty];
    const puzzle = generatePuzzle(config.size, getDailySeed(), config.prefill, config.logic);
    return buildShareBoard(puzzle);
  }, [hasCompletedToday, dailyDifficulty]);

  const shareText =
    hasCompletedToday && store.daily !== null
      ? buildShareText({
          today,
          difficulty: dailyDifficulty,
          seconds: store.daily,
          attempts: store.dailyWinAttempts,
          boardText,
        })
      : '';

  const handleShare = async () => {
    if (!shareText) return;

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ text: shareText });
        return;
      } catch (error) {
        if ((error as DOMException)?.name === 'AbortError') return;
        // fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyFailed(true);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={heading}>
      <div className="text-left">
        <h3 className="text-xs font-bold uppercase tracking-wider text-board/60 mb-3">
          STATISTICS
        </h3>

        <div className="grid grid-cols-4 gap-2 mb-6 text-center">
          <StatTile value={totalPlayed} label="Played" />
          <StatTile value={winPct} label="Win %" />
          <StatTile value={store.dailyStreak} label="Current Streak" />
          <StatTile value={store.maxDailyStreak} label="Max Streak" />
        </div>

        <h3 className="text-xs font-bold uppercase tracking-wider text-board/60 mb-3">
          BY DIFFICULTY
        </h3>

        <div className="space-y-3 mb-6">
          {DIFFICULTY_ROWS.map(({ key, label }) => {
            const modeStats: ModeStats = store.stats[key];
            const percent =
              maxPlayed > 0
                ? Math.max(MIN_BAR_PERCENT, Math.round((100 * modeStats.played) / maxPlayed))
                : MIN_BAR_PERCENT;
            const isTodaysDifficulty = key === dailyDifficulty;
            const avgSeconds =
              modeStats.solved > 0 ? Math.floor(modeStats.solvedSeconds / modeStats.solved) : null;
            const rowWinPct =
              modeStats.played > 0 ? Math.round((100 * modeStats.solved) / modeStats.played) : 0;

            return (
              <div key={key}>
                <div className="flex items-center gap-2">
                  <span className="font-bold w-16 shrink-0">{label}</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div
                      className={`h-6 rounded-md ${
                        isTodaysDifficulty ? 'bg-[#7BA898]' : 'bg-board/40'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                    <span className="text-xs font-black text-board">{modeStats.played}</span>
                  </div>
                </div>
                <p className="text-xs font-bold text-board/60 mt-1 ml-[calc(4rem+0.5rem)]">
                  {modeStats.solved}/{modeStats.played} solved · {rowWinPct}% · avg{' '}
                  {avgSeconds !== null ? formatTime(avgSeconds) : '–'}
                </p>
              </div>
            );
          })}
        </div>

        {hasCompletedToday && (
          <>
            <ActionButton variant="secondary" className="w-full" onClick={handleShare}>
              {copied ? 'Copied!' : 'Share'}
              <Share2 size={18} />
            </ActionButton>

            {copyFailed && (
              <>
                <pre className="text-sm font-mono bg-board/5 rounded-lg p-3 select-all mt-3">
                  {shareText}
                </pre>
                <p className="text-xs font-bold text-board/60 mt-2">
                  Copy the text above to share.
                </p>
              </>
            )}
          </>
        )}

        <ActionButton
          variant="ghost"
          className="w-full mt-3"
          onClick={showBackToMenu ? onBackToMenu : onClose}
        >
          {showBackToMenu ? 'Back to Menu' : 'Close'}
        </ActionButton>
      </div>
    </Modal>
  );
}
