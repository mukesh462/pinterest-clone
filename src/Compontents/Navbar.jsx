import { useState } from "react";

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" strokeWidth="2" />
    <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const MessageIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const PinterestLogo = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#E60023">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
  </svg>
);

const NAV_LINKS = ["Home", "Today", "Watch"];

export default function Navbar({
  user = null,
  onLogin,
  onSignup,
  onLogout,
  onCreateClick,
  searchQuery = "",
  onSearchChange,
}) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeNav, setActiveNav] = useState("Home");

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-2">
      <div className="max-w-screen-xl mx-auto flex items-center gap-3">

        {/* Logo */}
        <a href="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
          <PinterestLogo />
        </a>

        {/* Nav links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-1 flex-shrink-0">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => setActiveNav(link)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                activeNav === link
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {link}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className={`flex-1 max-w-2xl relative transition-all duration-200 ${searchFocused ? "ring-2 ring-gray-800 rounded-full" : ""}`}>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full bg-gray-100 rounded-full py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 outline-none focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange?.("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>

        {/* Right side */}
        {user ? (
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onCreateClick}
              className="px-4 py-2 rounded-full text-sm font-semibold text-gray-800 hover:bg-gray-100 transition-colors"
            >
              Create
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-full text-sm font-semibold text-gray-800 hover:bg-gray-100 transition-colors"
            >
              Logout
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors" aria-label="Notifications">
              <BellIcon />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors" aria-label="Messages">
              <MessageIcon />
            </button>
            <button className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full hover:bg-gray-100 transition-colors">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover bg-gray-200"
              />
              <span className="hidden md:block text-sm font-medium text-gray-800 max-w-[80px] truncate">
                {user.name}
              </span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onLogin}
              className="px-4 py-2 rounded-full text-sm font-semibold text-gray-800 hover:bg-gray-100 transition-colors"
            >
              Log in
            </button>
            <button
              onClick={onSignup}
              className="px-4 py-2 rounded-full text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Sign up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

/*
USAGE:
  // Logged out
  <Navbar onLogin={() => setModal('login')} onSignup={() => setModal('signup')} />

  // Logged in
  <Navbar user={{ name: "Priya", avatar: "/avatar.jpg" }} />
*/
