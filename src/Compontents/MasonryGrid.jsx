import { useState } from "react";

/* ─────────────────────────────────────────
   PIN CARD
   Props:
     pin: { id, imageUrl, title, description, author: { name, avatar }, saves, liked }
     onSave   — fn(pin)
     onLike   — fn(pin)
     onClick  — fn(pin)  →  opens PinDetail
   ───────────────────────────────────────── */

const HeartIcon = ({ filled }) => (
  <svg className="w-5 h-5" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <path strokeLinecap="round" d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
  </svg>
);

const DotsIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
  </svg>
);

export function PinCard({ pin, onSave, onLike, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [saved, setSaved] = useState(pin.saved ?? false);
  const [liked, setLiked] = useState(pin.liked ?? false);

  const handleSave = (e) => {
    e.stopPropagation();
    setSaved((s) => !s);
    onSave?.(pin);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked((l) => !l);
    onLike?.(pin);
  };

  return (
    <div
      className="relative group cursor-zoom-in rounded-2xl overflow-hidden bg-gray-100 break-inside-avoid mb-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick?.(pin)}
    >
      {/* Image */}
      <img
        src={pin.imageUrl}
        alt={pin.title || "Pin"}
        className="w-full object-cover block"
        loading="lazy"
        style={{ minHeight: "120px" }}
      />

      {/* Hover overlay */}
      <div className={`absolute inset-0 bg-black/20 transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"}`} />

      {/* Save button — top right */}
      <div className={`absolute top-3 right-3 transition-all duration-200 ${hovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}`}>
        <button
          onClick={handleSave}
          className={`px-4 py-2 rounded-full text-sm font-bold shadow-md transition-colors ${
            saved
              ? "bg-gray-900 text-white hover:bg-gray-700"
              : "bg-red-600 text-white hover:bg-red-700"
          }`}
        >
          {saved ? "Saved" : "Save"}
        </button>
      </div>

      {/* Bottom actions — like, share, more */}
      <div className={`absolute bottom-3 left-3 right-3 flex items-center justify-between transition-all duration-200 ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}>
        <div className="flex items-center gap-1">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              liked ? "bg-red-100 text-red-600" : "bg-white/80 text-gray-700 hover:bg-white"
            }`}
          >
            <HeartIcon filled={liked} />
          </button>
          {pin.saves > 0 && (
            <span className="text-white text-xs font-semibold drop-shadow">{pin.saves}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white backdrop-blur-sm transition-colors"
          >
            <ShareIcon />
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white backdrop-blur-sm transition-colors"
          >
            <DotsIcon />
          </button>
        </div>
      </div>

      {/* Title & author — below image on non-hover for mobile */}
      {pin.title && (
        <div className="px-3 pt-2 pb-1 md:hidden">
          <p className="text-sm font-semibold text-gray-900 truncate">{pin.title}</p>
        </div>
      )}

      {/* Author strip on hover (desktop) */}
      {pin.author && (
        <div className={`absolute bottom-14 left-3 right-3 hidden md:flex items-center gap-2 transition-all duration-200 ${hovered ? "opacity-100" : "opacity-0"}`}>
          <img
            src={pin.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${pin.author.name}`}
            alt={pin.author.name}
            className="w-6 h-6 rounded-full border-2 border-white object-cover"
          />
          <span className="text-white text-xs font-medium drop-shadow truncate">{pin.author.name}</span>
        </div>
      )}
    </div>
  );
}


/* ─────────────────────────────────────────
   MASONRY GRID
   Props:
     pins      — array of pin objects
     onSave    — fn(pin)
     onLike    — fn(pin)
     onClick   — fn(pin)
     lastPinRef — React ref attached to the last pin for infinite scroll
     loading   — bool
     columns   — override: { sm, md, lg } (default: 2, 3, 5)
   ───────────────────────────────────────── */

function SkeletonCard({ height }) {
  return (
    <div
      className="rounded-2xl bg-gray-200 animate-pulse mb-4"
      style={{ height: `${height}px` }}
    />
  );
}

const SKELETON_HEIGHTS = [220, 300, 180, 260, 340, 200, 280, 240, 190, 310];

export function MasonryGrid({
  pins = [],
  onSave,
  onLike,
  onClick,
  lastPinRef,
  loading = false,
  columns = { sm: 2, md: 3, lg: 5 },
}) {
  return (
    <div className="px-4 py-6">
      <div
        className={`
          columns-2
          md:columns-3
          lg:columns-5
          gap-4
        `}
        style={{
          columnCount: undefined,
          // We rely on Tailwind's responsive columns-N utilities above
        }}
      >
        {loading
          ? SKELETON_HEIGHTS.map((h, i) => <SkeletonCard key={i} height={h} />)
          : pins.map((pin, index) => {
              const isLast = index === pins.length - 1;
              return (
                <div key={pin.id} ref={isLast ? lastPinRef : null}>
                  <PinCard
                    pin={pin}
                    onSave={onSave}
                    onLike={onLike}
                    onClick={onClick}
                  />
                </div>
              );
            })}
      </div>

      {!loading && pins.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-2">📌</p>
          <p className="text-lg font-medium">No pins yet</p>
          <p className="text-sm mt-1">Search or explore to find ideas</p>
        </div>
      )}
    </div>
  );
}

/*
USAGE:

import { MasonryGrid } from "./MasonryGrid";

const PINS = [
  {
    id: "1",
    imageUrl: "https://source.unsplash.com/400x600?interior",
    title: "Cozy living room ideas",
    saves: 142,
    saved: false,
    liked: false,
    author: { name: "designstudio", avatar: null },
  },
  // ...
];

function Feed() {
  const [pins, setPins] = useState(PINS);

  return (
    <MasonryGrid
      pins={pins}
      onPinClick={(pin) => router.push(`/pin/${pin.id}`)}
      onPinSave={(pin) => console.log("saved", pin.id)}
      onPinLike={(pin) => console.log("liked", pin.id)}
    />
  );
}

// Infinite scroll — attach in parent:
useEffect(() => {
  const sentinel = document.getElementById("masonry-sentinel");
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) loadMorePins();
  }, { threshold: 0.1 });
  if (sentinel) observer.observe(sentinel);
  return () => observer.disconnect();
}, [pins]);
*/
