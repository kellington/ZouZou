import { BarChart3 } from 'lucide-react';
import { useStore } from '../lib/store';
import { formatTime, MODE_CONFIG, type Difficulty } from '../lib/puzzle';

const MODES: Difficulty[] = ['easy', 'medium', 'hard'];

export function PersonalStats() {
  const { store } = useStore();

  // Daily games are recorded under their board difficulty, so summing the
  // three modes already includes them.
  const totalPlayed = MODES.reduce((sum, mode) => sum + store.stats[mode].played, 0);

  return (
    <div className="bg-white p-4 rounded-xl border-2 border-board/10">
      <h3 className="font-black text-board mb-3 flex items-center justify-center gap-2 text-lg">
        <BarChart3 size={20} className="text-[#D97736]" />
        Personal Stats
      </h3>
      {totalPlayed === 0 ? (
        <p className="text-sm text-board/50 text-center font-bold">Play a game to start your stats!</p>
      ) : (
        <>
          <p className="text-center font-black text-board mb-3">
            Games played: <span className="font-mono tabular-nums">{totalPlayed}</span>
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-board/60">
                <th scope="col" className="text-left font-bold pb-1">Mode</th>
                <th scope="col" className="text-right font-bold pb-1">Played</th>
                <th scope="col" className="text-right font-bold pb-1">Solved</th>
                <th scope="col" className="text-right font-bold pb-1">Avg time</th>
              </tr>
            </thead>
            <tbody>
              {MODES.map((mode) => {
                const { played, solved, solvedSeconds } = store.stats[mode];
                const solvedPct = played > 0 ? `${Math.round((100 * solved) / played)}%` : '—';
                const avgTime = solved > 0 ? formatTime(Math.floor(solvedSeconds / solved)) : '—';
                return (
                  <tr key={mode}>
                    <th scope="row" className="text-left font-bold text-board/80 py-1">
                      {MODE_CONFIG[mode].title}
                    </th>
                    <td className="text-right font-mono tabular-nums font-bold text-board/80">{played}</td>
                    <td className="text-right font-mono tabular-nums font-bold text-board/80">{solvedPct}</td>
                    <td className="text-right font-mono tabular-nums font-bold text-board/80">{avgTime}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="text-xs text-board/50 text-center font-bold mt-3">
            Daily puzzles count toward their board size.
          </p>
        </>
      )}
    </div>
  );
}
