import {
  getGetRecentPlayersQueryKey,
  useGetRecentPlayers,
} from '@workspace/api-client-react';
import { AlertCircle, Users } from 'lucide-react';

function formatPlayedDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  return new Intl.DateTimeFormat('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function RecentPlayers() {
  const { data, isLoading, isError } = useGetRecentPlayers({
    query: {
      queryKey: getGetRecentPlayersQueryKey(),
      refetchInterval: 60_000,
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white/50 p-4 rounded-xl border-2 border-board/10 animate-pulse">
        <div className="h-6 w-36 bg-board/10 rounded mx-auto mb-4"></div>
        <div className="space-y-2">
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
        <p className="text-sm text-red-600 font-bold">Failed to load recent players.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl border-2 border-board/10">
      <h3 className="font-black text-board mb-3 flex items-center justify-center gap-2 text-lg">
        <Users size={20} className="text-[#D97736]" />
        Recent Players
      </h3>
      {(!data || data.entries.length === 0) ? (
        <p className="text-sm text-board/50 text-center font-bold">No games recorded yet.</p>
      ) : (
        <div className="space-y-2">
          {data.entries.map((entry) => (
            <div key={entry.name.toLocaleLowerCase()} className="flex justify-between items-center gap-4 text-sm">
              <span className="font-bold text-board/80 truncate">{entry.name}</span>
              <span className="text-board/50 font-bold whitespace-nowrap">
                {formatPlayedDate(entry.date)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}