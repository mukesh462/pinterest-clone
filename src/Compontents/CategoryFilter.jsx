import { useState, useRef, useEffect } from "react";

/* ─────────────────────────────────────────
   CATEGORY FILTER BAR
   Props:
     categories   — [{ id, label, icon? }]
     active       — id (string)
     onChange     — fn(id)
   ───────────────────────────────────────── */

export const DEFAULT_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "home-decor", label: "Home Decor" },
  { id: "food", label: "Food & Drink" },
  { id: "fashion", label: "Fashion" },
  { id: "travel", label: "Travel" },
  { id: "art", label: "Art" },
  { id: "nature", label: "Nature" },
  { id: "fitness", label: "Fitness" },
  { id: "diy", label: "DIY & Crafts" },
  { id: "tech", label: "Technology" },
  { id: "beauty", label: "Beauty" },
  { id: "pets", label: "Pets" },
  { id: "architecture", label: "Architecture" },
  { id: "photography", label: "Photography" },
];

export function CategoryFilter({ categories = DEFAULT_CATEGORIES, active = "all", onChange }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener("scroll", updateScrollState);
  }, []);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 240, behavior: "smooth" });
  };

  return (
    <div className="relative bg-white border-b border-gray-200 select-none">
      {/* Left fade + arrow */}
      {canScrollLeft && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <button
            onClick={() => scroll(-1)}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white rounded-full border border-gray-200 shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
            aria-label="Scroll left"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </>
      )}

      {/* Scrollable pills */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-4 py-3"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onChange?.(cat.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 ${
              active === cat.id
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Right fade + arrow */}
      {canScrollRight && (
        <>
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          <button
            onClick={() => scroll(1)}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white rounded-full border border-gray-200 shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
            aria-label="Scroll right"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}


/* ─────────────────────────────────────────
   SEARCH RESULTS DROPDOWN
   Drop this inside Navbar's search container
   Props:
     query    — string
     results  — [{ id, imageUrl, title, type: "pin"|"board"|"user" }]
     loading  — bool
     onSelect — fn(result)
     onClose  — fn()
   ───────────────────────────────────────── */

export function SearchDropdown({ query, results = [], loading = false, onSelect, onClose }) {
  if (!query) return null;

  return (
    <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50">
      {loading ? (
        <div className="px-4 py-8 flex items-center justify-center gap-2 text-gray-400">
          <div className="w-4 h-4 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
          <span className="text-sm">Searching…</span>
        </div>
      ) : results.length === 0 ? (
        <div className="px-4 py-8 text-center text-gray-400">
          <p className="text-sm">No results for "<strong className="text-gray-700">{query}</strong>"</p>
        </div>
      ) : (
        <div className="py-2">
          {results.map((r) => (
            <button
              key={r.id}
              onClick={() => { onSelect?.(r); onClose?.(); }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              {r.imageUrl ? (
                <img src={r.imageUrl} alt={r.title} className="w-10 h-10 rounded-xl object-cover bg-gray-100 flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{r.title}</p>
                <p className="text-xs text-gray-400 capitalize">{r.type}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/*
USAGE:

// Category filter
const [category, setCategory] = useState("all");
<CategoryFilter active={category} onChange={setCategory} />

// Then filter pins:
const filtered = category === "all" ? pins : pins.filter(p => p.category === category);


// Search dropdown — wire to debounced search API
const [query, setQuery] = useState("");
const [results, setResults] = useState([]);
const [searching, setSearching] = useState(false);

useEffect(() => {
  if (!query.trim()) { setResults([]); return; }
  const timer = setTimeout(async () => {
    setSearching(true);
    const res = await api.get(`/search?q=${query}`);
    setResults(res.data);
    setSearching(false);
  }, 300);
  return () => clearTimeout(timer);
}, [query]);

<div className="relative">
  <input value={query} onChange={(e) => setQuery(e.target.value)} />
  <SearchDropdown
    query={query}
    results={results}
    loading={searching}
    onSelect={(r) => router.push(`/${r.type}/${r.id}`)}
    onClose={() => setQuery("")}
  />
</div>
*/
