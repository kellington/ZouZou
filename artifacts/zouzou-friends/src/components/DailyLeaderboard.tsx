import { useGetDailyLeaderboard } from '@workspace/api-client-react';
import { formatTime } from '../lib/puzzle';
import { Trophy, AlertCircle } from 'lucide-react';

export function DailyLeaderboard() {
  const { data, isLoading, isError } = useGetDailyLeaderboard();

  if (isLoading) {
    return (
      <div className="bg-white/50 p-4 rounded-xl border-2 border-board/10 animate-pulse">
        <div className="h-6 w-32 bg-board/10 rounded mx-auto mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-board/10 rounded w-full"></div>
          <div className="h-4 bg-board/10 rounded w-full"></div>
          <div className="h-4 bg-board/10 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 p-4 rounded-xl border-2 border-red-200 text-center flex flex-col items-center">
        <AlertCircle className="text-red-500 mb-2" />
        <p className="text-sm text-red-600 font-bold">Failed to load leaderboard.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl border-2 border-board/10">
      <h3 className="font-black text-board mb-3 flex items-center justify-center gap-2 text-lg">
        <Trophy size={20} className="text-[#D97736]" />
        Today's Top 5
      </h3>
      {(!data || data.entries.length === 0) ? (
        <p className="text-sm text-board/50 text-center font-bold">No times yet. Be the first!</p>
      ) : (
        <div className="space-y-2">
          {data.entries.slice(0, 5).map((entry, i) => (
            <div key={i} className="flex justify-between items-center text-sm">
              <span className="font-bold text-board/80">
                <span className="inline-block w-4 text-board/40">{i + 1}.</span> {entry.name}
              </span>
              <span className="font-mono text-board font-black">{formatTime(entry.seconds)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
