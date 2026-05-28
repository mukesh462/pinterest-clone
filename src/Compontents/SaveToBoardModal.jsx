import React, { useEffect, useState } from "react";
import { X, Check, Plus, Loader2 } from "lucide-react";

const SaveToBoardModal = ({
  open,
  boards = [],
  pinId,
  onClose,
  onSave,
  onCreateBoard,
}) => {
  // =========================================================
  // STATES
  // =========================================================
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [boardName, setBoardName] = useState("");

  // =========================================================
  // RESET WHEN MODAL CLOSES
  // =========================================================
  useEffect(() => {
    if (!open) {
      setSelectedBoard(null);
      setShowCreateBoard(false);
      setBoardName("");
    }
  }, [open]);

  // =========================================================
  // SAVE PIN
  // =========================================================
  const handleSavePin = async () => {
    if (!selectedBoard || !pinId) {
      console.error("Save pin failed: missing pinId or boardId", {
        pinId,
        boardId: selectedBoard,
      });
      return;
    }

    try {
      setLoading(true);
      await onSave({ pinId, boardId: selectedBoard });
      onClose();
    } catch (error) {
      console.error("Save pin failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // CREATE BOARD
  // =========================================================
  const handleCreateBoard = async () => {
    if (!boardName.trim()) return;

    try {
      setLoading(true);
      const newBoard = await onCreateBoard({ name: boardName });
      setSelectedBoard(newBoard.id);
      setBoardName("");
      setShowCreateBoard(false);
    } catch (error) {
      console.error("Create board failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // CLOSE
  // =========================================================
  if (!open) return null;

  // =========================================================
  // UI
  // =========================================================
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Save to board</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BOARD LIST */}
        <div className="max-h-[420px] overflow-y-auto px-4 py-4 space-y-3">
          {boards.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No boards found.</p>
              <p className="text-sm text-gray-400 mt-2">
                Humanity’s eternal need to categorize images has not yet begun here.
              </p>
            </div>
          ) : (
            boards.map((board) => {
              const active = selectedBoard === board.id;

              return (
                <button
                  key={board.id}
                  onClick={() => setSelectedBoard(board.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border transition ${
                    active
                      ? "border-black bg-gray-100"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                    {/* FIXED: Added a fallback placeholder for missing images */}
                    {board.coverImage ? (
                      <img
                        src={board.coverImage}
                        alt={board.name}
                        className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xl uppercase flex-shrink-0">
                        {board.name ? board.name.charAt(0) : "?"}
                      </div>
                    )}

                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">
                        {board.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {board.pinCount} Pins
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}
                  {active && (
                    <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* CREATE BOARD */}
        <div className="px-5 pb-4">
          {!showCreateBoard ? (
            <button
              onClick={() => setShowCreateBoard(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-gray-300 hover:bg-gray-50 transition font-medium"
            >
              <Plus className="w-4 h-4" />
              Create New Board
            </button>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Board name"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                autoFocus
              />

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowCreateBoard(false)}
                  className="flex-1 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition font-medium"
                >
                  Cancel
                </button>

                <button
                  onClick={handleCreateBoard}
                  disabled={loading}
                  className="flex-1 py-3 rounded-2xl bg-black text-white hover:opacity-90 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-5 border-t border-gray-100">
          <button
            onClick={handleSavePin}
            disabled={!selectedBoard || !pinId || loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-full font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Pin
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveToBoardModal;
