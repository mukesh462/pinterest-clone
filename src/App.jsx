import { useMemo, useState } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

// =========================================================
// COMPONENTS
// =========================================================

import Navbar from "./Compontents/Navbar";
import AuthModal from "./Compontents/AuthModal";
import { MasonryGrid } from "./Compontents/MasonryGrid";
import PinDetail from "./Compontents/PinDetail";
import { CategoryFilter } from "./Compontents/CategoryFilter";
import UserProfile from "./Compontents/UserProfile";

import CreatePinModal from "./Compontents/CreatePinModal";
import SaveToBoardModal from "./Compontents/SaveToBoardModal";

// =========================================================
// HOOKS
// =========================================================

import { useAuth } from "./hooks/Auth";
import { useFeed } from "./hooks/useFeed";

// =========================================================
// API
// =========================================================

import api from "./services/api";

// =========================================================
// HOME PAGE
// =========================================================

function HomePage() {
  // =========================================================
  // AUTH
  // =========================================================

  const { user, login, register, logout, isAuthenticated } = useAuth();

  // =========================================================
  // STATES
  // =========================================================

  const [activeCategory, setActiveCategory] = useState("all");

  const [selectedPin, setSelectedPin] = useState(null);

  const [selectedPinLoading, setSelectedPinLoading] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [showSaveModal, setShowSaveModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
const [savingPin, setSavingPin] = useState(null);
  // =========================================================
  // BOARDS
  // =========================================================

  const [boards, setBoards] = useState([]);

  // =========================================================
  // FEED
  // =========================================================

  const {
    pins,
    loading,
    error,
    lastPinRef,
    prependPin,
    toggleLike,
    toggleSave,
  } = useFeed({
    category: activeCategory,
    search: searchQuery,
  });

  // =========================================================
  // FILTERED PINS
  // =========================================================

  const filteredPins = useMemo(() => {
    return pins.filter((pin) => {
      if (!searchQuery) return true;

      return (
        pin.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pin.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [pins, searchQuery]);

  // =========================================================
  // AUTH HANDLERS
  // =========================================================

  const handleLogin = async (credentials) => {
    const result = await login(credentials);

    if (result.success) {
      setShowAuthModal(false);
    }

    return result;
  };

  const handleRegister = async (payload) => {
    const result = await register(payload);

    if (result.success) {
      setShowAuthModal(false);
    }

    return result;
  };

  // =========================================================
  // CREATE PIN
  // =========================================================

  const loadBoards = async () => {
    try {
      const response = await api.get("/boards");
      setBoards(response.data.boards || []);
    } catch (error) {
      console.error("Failed to load boards:", error);
    }
  };

  const handleCreatePin = async (formData) => {
    try {
      const response = await api.post("/pins/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const createdPin = response.data.pin;

      prependPin(createdPin);

      setShowCreateModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  // =========================================================
  // SAVE PIN
  // =========================================================

  const handleSavePin = async ({ pinId, boardId }) => {
    try {
      await api.post("/boards/save-pin", {
        pinId,
        boardId,
      });

      toggleSave(pinId);

      setShowSaveModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLikePin = async (pinId) => {
    try {
      await api.post(`/pins/${pinId}/like`);
      toggleLike(pinId);

      if (selectedPin && selectedPin.id === pinId) {
        setSelectedPin((prev) =>
          prev
            ? {
                ...prev,
                liked: !prev.liked,
                likes: (prev.likes || 0) + (prev.liked ? -1 : 1),
              }
            : prev,
        );
      }
    } catch (error) {
      console.error("Like pin failed:", error);
    }
  };

  const handleComment = async ({ pinId, text }) => {
    try {
      await api.post(`/pins/${pinId}/comment`, {
        text,
      });
    } catch (error) {
      console.error("Comment failed:", error);
      throw error;
    }
  };

  // =========================================================
  // CREATE BOARD
  // =========================================================

  const handleCreateBoard = async (payload) => {
    try {
      const response = await api.post("/boards/create", payload);

      const newBoard = response.data.board;

      setBoards((prev) => [newBoard, ...prev]);

      return newBoard;
    } catch (error) {
      console.error(error);
    }
  };

  // =========================================================
  // OPEN CREATE MODAL
  // =========================================================

  const handleOpenCreateModal = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setShowCreateModal(true);
  };

  const handleOpenPinDetail = async (pin) => {
    setSelectedPin(pin);
    setSelectedPinLoading(true);

    try {
      const response = await api.get(`/pins/${pin.id}`);

      const detail = response.data.pin;
      detail.comments = (detail.comments || []).map((comment) => ({
        ...comment,
        author: comment.author || comment.user,
      }));

      setSelectedPin(detail);
    } catch (error) {
      console.error("Failed to load pin details:", error);
    } finally {
      setSelectedPinLoading(false);
    }
  };

  // =========================================================
  // OPEN SAVE MODAL
  // =========================================================
const handleOpenSaveModal = (pinData) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setSavingPin(pinData); // Store it in our new dedicated state
    setShowSaveModal(true);
    loadBoards();
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}

      <Navbar
        user={user}
        onLogin={() => setShowAuthModal(true)}
        onSignup={() => setShowAuthModal(true)}
        onLogout={logout}
        onCreateClick={handleOpenCreateModal}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* AUTH MODAL */}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        defaultTab="login"
      />

      {/* CREATE PIN MODAL */}

      <CreatePinModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePin}
      />

      {/* SAVE BOARD MODAL */}

     {/* SAVE BOARD MODAL */}
      <SaveToBoardModal
        open={showSaveModal}
        boards={boards}
        // This catches it if it's an object with an ID, OR if it's just a raw ID string
        pinId={savingPin?.id || savingPin?._id || savingPin}
        onClose={() => {
          setShowSaveModal(false);
          setSavingPin(null); // Clear the state when closing
        }}
        onSave={handleSavePin}
        onCreateBoard={handleCreateBoard}
      />

      {/* MAIN */}

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* CATEGORY */}

        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />

        {/* ERROR */}

        {error && (
          <div className="mt-5 bg-red-50 border border-red-200 text-red-600 rounded-2xl px-5 py-4">
            {error}
          </div>
        )}

        {/* GRID */}

        <div className="mt-6">
          <MasonryGrid
            pins={filteredPins}
            loading={loading}
            lastPinRef={lastPinRef}
            onSave={handleOpenSaveModal}
            onLike={handleLikePin}
            onClick={handleOpenPinDetail}
          />
        </div>

        {/* EMPTY */}

        {!loading && filteredPins.length === 0 && (
          <div className="py-24 text-center">
            <h2 className="text-3xl font-bold text-gray-900">No Pins Found</h2>

            <p className="text-gray-500 mt-4">
              The algorithm searched the void and returned nothing.
            </p>
          </div>
        )}
      </div>

      {/* PIN DETAIL */}

      {selectedPin && (
        <PinDetail
          pin={selectedPin}
          isOpen={true}
          onClose={() => setSelectedPin(null)}
          onSave={() => handleOpenSaveModal(selectedPin)}
          onLike={() => handleLikePin(selectedPin.id)}
          onComment={handleComment}
          currentUser={user}
        />
      )}
    </div>
  );
}

// =========================================================
// PROFILE PAGE
// =========================================================

function ProfilePage() {
  const [user] = useState({
    id: 1,

    name: "John Doe",

    username: "johndoe",

    avatar: "https://i.pravatar.cc/150?img=1",

    bio: "Designer & Creative Thinker",

    website: "https://johndoe.com",

    location: "San Francisco, CA",

    followersCount: 1200,

    followingCount: 450,

    pinsCount: 87,
  });

  const [activeTab, setActiveTab] = useState("created");

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-screen-lg mx-auto px-4 py-8">
        <UserProfile
          user={user}
          isOwnProfile={true}
          onFollow={() => console.log("Followed")}
          onEdit={() => console.log("Edit profile")}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
}

// =========================================================
// APP
// =========================================================

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/profile/:userId" element={<ProfilePage />} />

        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
