import { useState } from "react";

/* ─────────────────────────────────────────
   USER PROFILE HEADER
   Props:
     user: {
       id, name, username, avatar, bio,
       website, location,
       followersCount, followingCount, pinsCount,
     }
     isOwnProfile  — bool (shows Edit Profile btn)
     onFollow      — fn(user)
     onEdit        — fn()
     activeTab     — "created" | "saved"
     onTabChange   — fn(tab)
   ───────────────────────────────────────── */

const LinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const DotsIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

function Stat({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-base font-bold text-gray-900">{value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

const TABS = [
  { key: "created", label: "Created" },
  { key: "saved", label: "Saved" },
];

export default function UserProfile({
  user,
  isOwnProfile = false,
  onFollow,
  onEdit,
  activeTab = "created",
  onTabChange,
}) {
  const [following, setFollowing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  const handleFollow = () => {
    setFollowing((f) => !f);
    onFollow?.(user);
  };

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="max-w-2xl mx-auto px-4 pt-8 pb-0">

      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center border-4 border-white shadow-md">
              <span className="text-3xl font-bold text-white">{initials}</span>
            </div>
          )}
          {isOwnProfile && (
            <button
              onClick={onEdit}
              className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Edit avatar"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Name & username */}
      <div className="text-center mb-3">
        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
        <p className="text-sm text-gray-500 mt-0.5">@{user.username || user.name?.toLowerCase().replace(/\s/g, "")}</p>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-8 mb-4">
        <Stat label="Followers" value={user.followersCount ?? 0} />
        <Stat label="Following" value={user.followingCount ?? 0} />
        <Stat label="Pins" value={user.pinsCount ?? 0} />
      </div>

      {/* Bio */}
      {user.bio && (
        <p className="text-center text-sm text-gray-600 max-w-xs mx-auto mb-3 leading-relaxed">
          {user.bio}
        </p>
      )}

      {/* Meta — website, location */}
      <div className="flex justify-center flex-wrap gap-4 mb-5 text-xs text-gray-500">
        {user.website && (
          <a
            href={user.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-red-600 transition-colors"
          >
            <LinkIcon />
            {user.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </a>
        )}
        {user.location && (
          <span className="flex items-center gap-1.5">
            <LocationIcon />
            {user.location}
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-2 mb-7">
        {isOwnProfile ? (
          <>
            <button
              onClick={onEdit}
              className="px-5 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-800 transition-colors"
            >
              Edit profile
            </button>
            <button className="px-5 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-800 transition-colors flex items-center gap-2">
              <ShareIcon />
              Share
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleFollow}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-colors ${
                following
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {following ? "Following" : "Follow"}
            </button>
            <button className="px-5 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-800 transition-colors">
              Message
            </button>
            <div className="relative">
              <button
                onClick={() => setShowDropdown((v) => !v)}
                className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                aria-label="More options"
              >
                <DotsIcon />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-10">
                  {["Report user", "Block user"].map((item) => (
                    <button
                      key={item}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => onTabChange?.(t.key)}
            className={`relative px-6 pb-3 pt-1 text-sm font-semibold transition-colors ${
              activeTab === t.key
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
            {activeTab === t.key && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gray-900 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/*
USAGE:

const [tab, setTab] = useState("created");

<UserProfile
  user={{
    name: "Priya Sharma",
    username: "priyabuilds",
    avatar: "/avatar.jpg",
    bio: "Designer & creator. Obsessed with interiors and plant-based cooking.",
    website: "https://priya.design",
    location: "Chennai, IN",
    followersCount: 3420,
    followingCount: 210,
    pinsCount: 89,
  }}
  isOwnProfile={false}
  activeTab={tab}
  onTabChange={setTab}
  onFollow={(user) => followUser(user.id)}
/>
*/
