import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getGetCommentsQueryKey,
  useGetComments,
  usePostComment,
  type Comment,
} from '@workspace/api-client-react';
import { AlertCircle, MessageCircle } from 'lucide-react';
import { ActionButton, Modal } from './ui';
import { useStore } from '../lib/store';

const maxMessageLength = 200;

// "just now", "5m ago", "3h ago", then "Oct 25" (Edmonton date).
function formatWhen(createdAt: string): string {
  const minutes = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 24 * 60) return `${Math.floor(minutes / 60)}h ago`;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'America/Edmonton',
  }).format(new Date(createdAt));
}

function CommentRow({ comment }: { comment: Comment }) {
  return (
    <div className="text-sm text-left">
      <div className="flex justify-between items-baseline gap-2">
        <span className="font-black text-board truncate">{comment.name}</span>
        <span className="text-xs font-bold text-board/40 whitespace-nowrap">{formatWhen(comment.createdAt)}</span>
      </div>
      <p className="font-medium text-board/80 break-words">{comment.message}</p>
    </div>
  );
}

export function TrashTalk() {
  const queryClient = useQueryClient();
  const { store, setPlayerName } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const { data, isLoading, isError } = useGetComments({
    query: {
      queryKey: getGetCommentsQueryKey(),
      refetchInterval: 60_000,
    },
  });
  const { mutate: postComment, isPending, isError: postFailed } = usePostComment({
    mutation: {
      onSuccess: () => {
        setMessage('');
        queryClient.invalidateQueries({ queryKey: getGetCommentsQueryKey() });
      },
    },
  });

  const entries = data?.entries ?? [];
  const posterName = store.playerName || name.trim();
  const canPost = posterName.length > 0 && message.trim().length > 0 && !isPending;

  const submit = () => {
    if (!canPost) return;
    // First comment from a nameless browser saves the name, like the leaderboard does.
    if (!store.playerName) setPlayerName(posterName);
    postComment({ data: { name: posterName, message: message.trim() } });
  };

  if (isLoading) {
    return (
      <div className="bg-white/50 p-4 rounded-xl border-2 border-board/10 animate-pulse">
        <div className="h-6 w-32 bg-board/10 rounded mx-auto mb-4"></div>
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
        <p className="text-sm text-red-600 font-bold">Failed to load trash talk.</p>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-white p-4 rounded-xl border-2 border-board/10 hover:border-board/30 transition-colors"
      >
        <h3 className="font-black text-board mb-3 flex items-center justify-center gap-2 text-lg">
          <MessageCircle size={20} className="text-[#D97736]" />
          Trash Talk
        </h3>
        {entries.length === 0 ? (
          <p className="text-sm text-board/50 text-center font-bold">No trash talk yet. Start something!</p>
        ) : (
          <div className="space-y-2">
            {entries.slice(0, 3).map((comment) => (
              <CommentRow key={comment.id} comment={comment} />
            ))}
          </div>
        )}
        <p className="text-xs font-bold text-board/40 mt-3">Tap to see all and post</p>
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="💬 Trash Talk">
        <div className="space-y-2 mb-4">
          {!store.playerName && (
            <input
              type="text"
              placeholder="Your name"
              maxLength={24}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border-2 border-board bg-white font-bold text-board outline-none focus:ring-2 focus:ring-[#D97736]"
            />
          )}
          <textarea
            placeholder={store.playerName ? `Say something, ${store.playerName}…` : 'Say something…'}
            maxLength={maxMessageLength}
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border-2 border-board bg-white font-medium text-board outline-none focus:ring-2 focus:ring-[#D97736] resize-none"
          />
          <div className="flex justify-between items-center gap-2">
            <span className="text-xs font-bold text-board/40">
              {message.length}/{maxMessageLength}
            </span>
            <ActionButton onClick={submit} disabled={!canPost}>
              {isPending ? 'Posting…' : 'Post'}
            </ActionButton>
          </div>
          {postFailed && <p className="text-sm text-red-600 font-bold">Couldn't post — try again.</p>}
        </div>

        <div className="space-y-3 mb-6 border-t-2 border-board/10 pt-4">
          {entries.length === 0 ? (
            <p className="text-sm text-board/50 font-bold">No trash talk yet.</p>
          ) : (
            entries.map((comment) => <CommentRow key={comment.id} comment={comment} />)
          )}
        </div>
        <ActionButton variant="ghost" className="w-full" onClick={() => setIsOpen(false)}>
          Close
        </ActionButton>
      </Modal>
    </>
  );
}
