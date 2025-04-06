"use client";

import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// Create the auth context
const AuthContext = createContext();

// Base URL for API requests
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Temporarily skip authentication check
    // const checkAuthStatus = async () => {
    //   const token = localStorage.getItem("authToken");
    //
    //   if (!token) {
    //     setLoading(false);
    //     return;
    //   }
    //
    //   try {
    //     const config = {
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${token}`,
    //       },
    //     };
    //
    //     const response = await axios.get(`${API_BASE_URL}/users/me`, config);
    //     if (response.data) {
    //       setUser(response.data);
    //       setIsAuthenticated(true);
    //     }
    //   } catch (error) {
    //     console.error("Auth status check failed:", error);
    //     localStorage.removeItem("authToken");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    //
    // checkAuthStatus();

    // Skip loading for testing

    setIsAuthenticated(true);
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    setError(null);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        { email, password },
        config
      );

      const { token, user } = response.data;

      localStorage.setItem("authToken", token);
      setUser(user);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Greška pri prijavi. Provjerite svoje podatke."
      );
      return false;
    }
  };

  // Register function
  const register = async (userData) => {
    setError(null);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        userData,
        config
      );

      const { token, user } = response.data;

      localStorage.setItem("authToken", token);
      setUser(user);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Greška pri registraciji. Pokušajte ponovo."
      );
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setError(null);

    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("Niste prijavljeni.");
        return false;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        `${API_BASE_URL}/users/profile`,
        userData,
        config
      );

      setUser(response.data);
      return true;
    } catch (error) {
      setError(
        error.response?.data?.message || "Greška pri ažuriranju profila."
      );
      return false;
    }
  };

  // Clear any errors
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        clearError,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
