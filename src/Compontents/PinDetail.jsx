import { useState, useRef, useEffect } from "react";

/* ─────────────────────────────────────────
   PIN DETAIL MODAL
   Props:
     pin: {
       id, imageUrl, title, description, tags,
       sourceUrl,
       author: { id, name, username, avatar, followersCount },
       saves, likes, liked, saved,
       comments: [{ id, author: {...}, text, createdAt, likes }],
       createdAt,
     }
     isOpen     — bool
     onClose    — fn()
     onSave     — fn(pin)
     onLike     — fn(pin)
     onFollow   — fn(authorId)
     onComment  — fn({ pinId, text }) → Promise
     currentUser — { id, name, avatar } | null
   ───────────────────────────────────────── */

/* ── API shape adapter ───────────────────────
   Backend returns comment.user; component
   expects comment.author. Normalize here so
   neither the API nor the component changes.
   Also handles missing createdAt gracefully.
   ─────────────────────────────────────────── */
function normalizeComment(c) {
  return {
    ...c,
    author: c.author ?? c.user ?? { name: "Unknown", avatar: null },
    createdAt: c.createdAt ?? c.created_at ?? new Date().toISOString(),
    likes: c.likes ?? 0,
  };
}

const HeartIcon = ({ filled }) => (
  <svg className="w-5 h-5" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <path strokeLinecap="round" d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
  </svg>
);

const ExternalIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function Comment({ comment }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="flex gap-3 group">
      <img
        src={comment.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author.name}`}
        alt={comment.author.name}
        className="w-8 h-8 rounded-full flex-shrink-0 mt-0.5 object-cover bg-gray-100"
      />
      <div className="flex-1 min-w-0">
        <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
          <p className="text-xs font-semibold text-gray-900 mb-0.5">{comment.author.name}</p>
          <p className="text-sm text-gray-700 leading-relaxed">{comment.text}</p>
        </div>
        <div className="flex items-center gap-3 mt-1.5 px-2">
          <button
            onClick={() => setLiked((l) => !l)}
            className={`flex items-center gap-1 text-xs transition-colors ${
              liked ? "text-red-500 font-medium" : "text-gray-400 hover:text-gray-700"
            }`}
          >
            <HeartIcon filled={liked} />
            {comment.likes > 0 && <span>{liked ? comment.likes + 1 : comment.likes}</span>}
          </button>
          <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
          <button className="text-xs text-gray-400 hover:text-gray-700 transition-colors opacity-0 group-hover:opacity-100">
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PinDetail({
  pin,
  isOpen,
  onClose,
  onSave,
  onLike,
  onFollow,
  onComment,
  currentUser = null,
}) {
  const [saved, setSaved] = useState(pin?.saved ?? false);
  const [liked, setLiked] = useState(pin?.liked ?? false);
  const [following, setFollowing] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState((pin?.comments ?? []).map(normalizeComment));
  const [submitting, setSubmitting] = useState(false);
  const commentInputRef = useRef(null);
useEffect(() => {
    if (pin) {
      setSaved(pin.saved ?? false);
      setLiked(pin.liked ?? false);
      setLocalComments((pin.comments ?? []).map(normalizeComment));
    }
  }, [pin]); // <--- Update this dependency// <--- THIS IS THE PROBLEM

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !pin) return null;

  const handleSave = () => { setSaved((s) => !s); onSave?.(pin); };
  const handleLike = () => { setLiked((l) => !l); onLike?.(pin); };
  const handleFollow = () => { setFollowing((f) => !f); onFollow?.(pin.author?.id); };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onComment?.({ pinId: pin.id, text: commentText });
      setLocalComments((prev) => [
        {
          id: Date.now().toString(),
          author: currentUser || { name: "You", avatar: null },
          text: commentText,
          createdAt: new Date().toISOString(),
          likes: 0,
        },
        ...prev,
      ]);
      setCommentText("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Close button — outside modal */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 p-2 rounded-full bg-white/90 text-gray-700 hover:bg-white shadow-md transition-colors z-10"
        aria-label="Close"
      >
        <CloseIcon />
      </button>

      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* Left — Image */}
        <div className="md:w-1/2 bg-gray-100 flex-shrink-0 flex items-center justify-center relative min-h-64 md:min-h-0">
          <img
            src={pin.imageUrl}
            alt={pin.title || "Pin"}
            className="w-full h-full object-cover"
            style={{ maxHeight: "90vh" }}
          />
          {pin.sourceUrl && (
            <a
              href={pin.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 rounded-full text-xs font-medium text-gray-700 hover:bg-white shadow-sm transition-colors backdrop-blur-sm"
            >
              <ExternalIcon />
              Visit
            </a>
          )}
        </div>

        {/* Right — Details + Comments */}
        <div className="md:w-1/2 flex flex-col overflow-hidden">

          {/* Top actions */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`p-2.5 rounded-full transition-colors ${
                  liked ? "bg-red-50 text-red-500" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                aria-label="Like"
              >
                <HeartIcon filled={liked} />
              </button>
              {(pin.likes ?? 0) + (liked ? 1 : 0) > 0 && (
                <span className="text-sm text-gray-500">{pin.likes + (liked ? 1 : 0)}</span>
              )}
              <button
                onClick={() => {}}
                className="p-2.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors ml-1"
                aria-label="Share"
              >
                <ShareIcon />
              </button>
            </div>
            <button
              onClick={handleSave}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${
                saved
                  ? "bg-gray-900 text-white hover:bg-gray-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {saved ? "Saved" : "Save"}
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {/* Title & description */}
            <div>
              {pin.title && (
                <h2 className="text-xl font-bold text-gray-900 leading-tight mb-2">{pin.title}</h2>
              )}
              {pin.description && (
                <p className="text-sm text-gray-600 leading-relaxed">{pin.description}</p>
              )}
              {pin.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {pin.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-gray-100 rounded-full text-xs text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Author */}
            {pin.author && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={pin.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${pin.author.name}`}
                    alt={pin.author.name}
                    className="w-10 h-10 rounded-full object-cover bg-gray-100"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{pin.author.name}</p>
                    <p className="text-xs text-gray-400">
                      {pin.author.followersCount != null
                        ? `${pin.author.followersCount >= 1000 ? `${(pin.author.followersCount / 1000).toFixed(1)}k` : pin.author.followersCount} followers`
                        : `@${pin.author.username || pin.author.name}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleFollow}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                    following
                      ? "bg-gray-100 hover:bg-gray-200 text-gray-800"
                      : "bg-gray-900 hover:bg-gray-700 text-white"
                  }`}
                >
                  {following ? "Following" : "Follow"}
                </button>
              </div>
            )}

            {/* Comments */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                {localComments.length > 0 ? `${localComments.length} comment${localComments.length !== 1 ? "s" : ""}` : "Comments"}
              </h3>
              <div className="space-y-4">
                {localComments.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No comments yet. Be the first!</p>
                ) : (
                  localComments.map((c) => <Comment key={c.id} comment={c} />)
                )}
              </div>
            </div>
          </div>

          {/* Comment input — pinned at bottom */}
          <form
            onSubmit={handleCommentSubmit}
            className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 flex-shrink-0 bg-white"
          >
            {currentUser && (
              <img
                src={currentUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full flex-shrink-0 object-cover bg-gray-100"
              />
            )}
            <div className="flex-1 relative">
              <input
                ref={commentInputRef}
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment…"
                className="w-full bg-gray-100 rounded-full py-2.5 px-4 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                maxLength={500}
              />
              {commentText.trim() && (
                <button
                  type="submit"
                  disabled={submitting}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600 hover:text-red-700 font-semibold text-xs transition-colors disabled:opacity-50"
                >
                  Post
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/*
USAGE:

const [selectedPin, setSelectedPin] = useState(null);

<PinDetail
  pin={selectedPin}
  isOpen={!!selectedPin}
  onClose={() => setSelectedPin(null)}
  currentUser={authUser}
  onSave={(pin) => savePin(pin.id)}
  onLike={(pin) => likePin(pin.id)}
  onFollow={(authorId) => followUser(authorId)}
  onComment={async ({ pinId, text }) => {
    await api.post(`/pins/${pinId}/comments`, { text });
  }}
/>
*/