import React from "react";

import {
  Lock,
  Globe,
  MoreHorizontal,
} from "lucide-react";

const BoardCard = ({
  board,
  onOpen,
  onEdit,
  onDelete,
}) => {
  // =========================================================
  // SAFE FALLBACKS
  // =========================================================

  const coverImage =
    board?.coverImage ||
    "https://images.unsplash.com/photo-1494526585095-c41746248156";

  const title = board?.name || "Untitled Board";

  const pinCount = board?.pinCount || 0;

  const isPrivate = board?.isPrivate || false;

  const collaborators =
    board?.collaborators || [];

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="group relative">
      {/* CARD */}

      <div
        onClick={() => onOpen(board)}
        className="cursor-pointer"
      >
        {/* IMAGE */}

        <div className="relative overflow-hidden rounded-[28px] bg-gray-100">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-[320px] object-cover transition duration-500 group-hover:scale-105"
          />

          {/* OVERLAY */}

          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-300" />

          {/* TOP ACTION */}

          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition duration-300">
            <button
              onClick={(event) => {
                event.stopPropagation();

                onEdit?.(board);
              }}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white shadow-md"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-800" />
            </button>
          </div>

          {/* BOTTOM INFO */}

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            {/* COLLABORATORS */}

            <div className="flex -space-x-3">
              {collaborators
                .slice(0, 3)
                .map((user, index) => (
                  <img
                    key={index}
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                ))}
            </div>

            {/* VISIBILITY */}

            <div className="bg-white/90 backdrop-blur px-3 py-2 rounded-full flex items-center gap-2 shadow-sm">
              {isPrivate ? (
                <Lock className="w-4 h-4 text-gray-700" />
              ) : (
                <Globe className="w-4 h-4 text-gray-700" />
              )}

              <span className="text-sm font-medium text-gray-800">
                {isPrivate
                  ? "Private"
                  : "Public"}
              </span>
            </div>
          </div>
        </div>

        {/* CONTENT */}

        <div className="mt-4 px-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                {title}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {pinCount}{" "}
                {pinCount === 1
                  ? "Pin"
                  : "Pins"}
              </p>
            </div>

            {/* DELETE */}

            {onDelete && (
              <button
                onClick={(event) => {
                  event.stopPropagation();

                  onDelete(board);
                }}
                className="opacity-0 group-hover:opacity-100 text-sm text-red-500 hover:text-red-600 transition"
              >
                Delete
              </button>
            )}
          </div>

          {/* DESCRIPTION */}

          {board?.description && (
            <p className="text-sm text-gray-500 mt-3 line-clamp-2 leading-relaxed">
              {board.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardCard;

/*
=========================================================

USAGE:

import BoardCard from "./BoardCard";

const boards = [
  {
    id: 1,

    name: "Dream Apartment",

    description:
      "Interior inspiration and minimalist setups.",

    coverImage:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",

    pinCount: 42,

    isPrivate: false,

    collaborators: [
      {
        name: "Mukesh",
        avatar:
          "https://i.pravatar.cc/100?img=1",
      },

      {
        name: "John",
        avatar:
          "https://i.pravatar.cc/100?img=2",
      },
    ],
  },
];

<BoardCard
  board={board}
  onOpen={(board) =>
    navigate(`/boards/${board.id}`)
  }
  onEdit={(board) =>
    console.log("Edit", board)
  }
  onDelete={(board) =>
    console.log("Delete", board)
  }
/>

=========================================================
*/