import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // =========================================================
  // STATES
  // =========================================================

  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("access_token")
  );

  const [loading, setLoading] = useState(true);

  // =========================================================
  // LOAD USER FROM LOCAL STORAGE
  // =========================================================

  useEffect(() => {
    const storedUser =
      localStorage.getItem("auth_user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // =========================================================
  // LOGIN
  // =========================================================

  const login = async (payload) => {
    try {
      const response = await api.post(
        "/auth/login",
        payload
      );

      // ==========================================
      // EXPECTED JWT RESPONSE
      // ==========================================

      /*
        {
          user: {},
          access_token: "",
        }
      */

      const loggedInUser =
        response.data.user;

      const accessToken =
        response.data.token;

      // ==========================================
      // SAVE STATE
      // ==========================================

      setUser(loggedInUser);
      setToken(accessToken);

      // ==========================================
      // SAVE LOCAL STORAGE
      // ==========================================

      localStorage.setItem(
        "auth_user",
        JSON.stringify(loggedInUser)
      );

      localStorage.setItem(
        "access_token",
        accessToken
      );

      return {
        success: true,
        user: loggedInUser,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Login failed",
      };
    }
  };

  // =========================================================
  // REGISTER
  // =========================================================

  const register = async (payload) => {
    try {
      const response = await api.post(
        "/auth/register",
        payload
      );

      const createdUser =
        response.data.user;

      const accessToken =
        response.data.token;

      setUser(createdUser);
      setToken(accessToken);

      localStorage.setItem(
        "auth_user",
        JSON.stringify(createdUser)
      );

      localStorage.setItem(
        "access_token",
        accessToken
      );

      return {
        success: true,
        user: createdUser,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Registration failed",
      };
    }
  };

  // =========================================================
  // GET CURRENT USER
  // OPTIONAL API VERIFY
  // =========================================================

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get(
        "/auth/me"
      );

      setUser(response.data.user);

      localStorage.setItem(
        "auth_user",
        JSON.stringify(response.data.user)
      );
    } catch (error) {
      logout();
    }
  };

  useEffect(() => {
    if (token && !user) {
      fetchCurrentUser();
    }
  }, [token, user]);

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("auth_user");
    localStorage.removeItem("access_token");
  };

  // =========================================================
  // AUTH STATUS
  // =========================================================

  const isAuthenticated =
    !!user && !!token;

  // =========================================================
  // CONTEXT VALUE
  // =========================================================

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated,

      login,
      register,
      logout,
      fetchCurrentUser,
    }),

    [
      user,
      token,
      loading,
      isAuthenticated,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// =========================================================
// CUSTOM HOOK
// =========================================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
};