/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { fetchWithAuth } from "../utils/api";

const FavoritesContext = createContext();

function getStorageKey() {
  const token = localStorage.getItem("authToken");
  if (!token) return "favorites_guest";
  try {
    const decoded = jwtDecode(token);
    return decoded?.id ? `favorites_user_${decoded.id}` : "favorites_guest";
  } catch {
    return "favorites_guest";
  }
}

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const key = getStorageKey();
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");

  // Fetch saved jobs from backend API
  const fetchBackendSavedJobs = useCallback(async () => {
    if (!token || role !== "user") return;
    try {
      setLoading(true);
      const res = await fetchWithAuth("/saved-jobs?limit=50");
      if (res.ok) {
        const data = await res.json();
        const serverJobs = (data.savedJobs || [])
          .map((item) => item.job)
          .filter(Boolean);
        setFavorites(serverJobs);
        const key = getStorageKey();
        localStorage.setItem(key, JSON.stringify(serverJobs));
      }
    } catch (err) {
      console.error("Failed to sync saved jobs with server:", err);
    } finally {
      setLoading(false);
    }
  }, [token, role]);

  useEffect(() => {
    fetchBackendSavedJobs();
  }, [fetchBackendSavedJobs]);

  const addFavorite = async (job) => {
    const jobId = job._id || job.id;
    setFavorites((prev) => {
      if (prev.some((j) => (j._id || j.id) === jobId)) return prev;
      const updated = [...prev, job];
      localStorage.setItem(getStorageKey(), JSON.stringify(updated));
      return updated;
    });

    if (token && role === "user") {
      try {
        await fetchWithAuth(`/saved-jobs/${jobId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
      } catch (err) {
        console.error("Failed to save job on server:", err);
      }
    }
  };

  const removeFavorite = async (jobId) => {
    setFavorites((prev) => {
      const updated = prev.filter((j) => (j._id || j.id) !== jobId);
      localStorage.setItem(getStorageKey(), JSON.stringify(updated));
      return updated;
    });

    if (token && role === "user") {
      try {
        await fetchWithAuth(`/saved-jobs/${jobId}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.error("Failed to remove saved job from server:", err);
      }
    }
  };

  const isFavorite = (jobId) => {
    return favorites.some((j) => (j._id || j.id) === jobId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        loading,
        refreshFavorites: fetchBackendSavedJobs,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
