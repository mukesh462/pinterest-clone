import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import api from "../services/api";

const PAGE_SIZE = 20;

export const useFeed = ({
  category = "all",
  search = "",
} = {}) => {
  // =========================================================
  // STATES
  // =========================================================

  const [pins, setPins] = useState([]);

  const [page, setPage] = useState(1);

  const [loading, setLoading] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const [hasMore, setHasMore] =
    useState(true);

  const [error, setError] = useState(null);

  // =========================================================
  // OBSERVER REF
  // =========================================================

  const observerRef = useRef(null);

  // =========================================================
  // FETCH PINS
  // =========================================================

  const fetchPins = useCallback(
    async ({
      pageNumber = 1,
      replace = false,
    } = {}) => {
      try {
        setLoading(true);

        setError(null);

        const response = await api.get(
          "/pins",
          {
            params: {
              page: pageNumber,
              limit: PAGE_SIZE,

              category:
                category !== "all"
                  ? category
                  : undefined,

              search:
                search || undefined,
            },
          }
        );

        /*
        EXPECTED RESPONSE:

        {
          pins: [],
          pagination: {
            currentPage: 1,
            totalPages: 10,
            hasMore: true
          }
        }
        */

        const fetchedPins =
          response.data?.pins || [];

        const pagination =
          response.data?.pagination;

        setPins((prevPins) =>
          replace
            ? fetchedPins
            : [...prevPins, ...fetchedPins]
        );

        // =========================================
        // PAGINATION
        // =========================================

        if (pagination) {
          setHasMore(
            pagination.hasMore
          );
        } else {
          setHasMore(
            fetchedPins.length >=
              PAGE_SIZE
          );
        }
      } catch (err) {
        console.error(
          "Feed fetch failed:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Something went wrong while fetching feed."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },

    [category, search]
  );

  // =========================================================
  // INITIAL FETCH
  // =========================================================

  useEffect(() => {
    setPins([]);
    setPage(1);
    setHasMore(true);

    fetchPins({
      pageNumber: 1,
      replace: true,
    });
  }, [category, search]);

  // =========================================================
  // LOAD MORE
  // =========================================================

  useEffect(() => {
    if (page === 1) return;

    fetchPins({
      pageNumber: page,
    });
  }, [page]);

  // =========================================================
  // INFINITE SCROLL
  // =========================================================

  const lastPinRef = useCallback(
    (node) => {
      if (loading) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current =
        new IntersectionObserver(
          (entries) => {
            if (
              entries[0].isIntersecting &&
              hasMore
            ) {
              setPage(
                (prevPage) =>
                  prevPage + 1
              );
            }
          },

          {
            threshold: 0.1,
            rootMargin: "300px",
          }
        );

      if (node) {
        observerRef.current.observe(
          node
        );
      }
    },

    [loading, hasMore]
  );

  // =========================================================
  // REFRESH FEED
  // =========================================================

  const refreshFeed = async () => {
    setRefreshing(true);

    setPage(1);

    await fetchPins({
      pageNumber: 1,
      replace: true,
    });
  };

  // =========================================================
  // ADD PIN
  // =========================================================

  const prependPin = (newPin) => {
    setPins((prevPins) => [
      newPin,
      ...prevPins,
    ]);
  };

  // =========================================================
  // REMOVE PIN
  // =========================================================

  const removePin = (pinId) => {
    setPins((prevPins) =>
      prevPins.filter(
        (pin) => pin.id !== pinId
      )
    );
  };

  // =========================================================
  // UPDATE PIN
  // =========================================================

  const updatePin = (updatedPin) => {
    setPins((prevPins) =>
      prevPins.map((pin) =>
        pin.id === updatedPin.id
          ? updatedPin
          : pin
      )
    );
  };

  // =========================================================
  // TOGGLE LIKE
  // =========================================================

  const toggleLike = (pinId) => {
    setPins((prevPins) =>
      prevPins.map((pin) => {
        if (pin.id !== pinId)
          return pin;

        return {
          ...pin,

          liked: !pin.liked,

          likes: pin.liked
            ? pin.likes - 1
            : pin.likes + 1,
        };
      })
    );
  };

  // =========================================================
  // TOGGLE SAVE
  // =========================================================

  const toggleSave = (pinId) => {
    setPins((prevPins) =>
      prevPins.map((pin) => {
        if (pin.id !== pinId)
          return pin;

        return {
          ...pin,
          saved: !pin.saved,
        };
      })
    );
  };

  // =========================================================
  // RETURN
  // =========================================================

  return {
    // DATA
    pins,

    // STATUS
    loading,
    refreshing,
    hasMore,
    error,

    // INFINITE SCROLL
    lastPinRef,

    // ACTIONS
    refreshFeed,
    prependPin,
    removePin,
    updatePin,
    toggleLike,
    toggleSave,
  };
};

/*
=========================================================

USAGE:

const {
  pins,
  loading,
  error,
  hasMore,
  lastPinRef,
  refreshFeed,
  toggleLike,
  toggleSave,
} = useFeed({
  category: selectedCategory,
  search: searchQuery,
});

---------------------------------------------------------

<MasonryGrid
  pins={pins}
  lastPinRef={lastPinRef}
  onLike={toggleLike}
  onSave={toggleSave}
/>

=========================================================
*/