const API_BASE_URL = "http://localhost:3000/api";

export const apiService = {
  // Auth endpoints
  auth: {
    setupAdmin: async (email, password, fullName) => {
      const res = await fetch(`${API_BASE_URL}/auth/setup-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, fullName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Setup failed");
      return data;
    },

    login: async (email, password) => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      return data;
    },

    signup: async (email, password, fullName, role = "user") => {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, fullName, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      return data;
    },

    logout: async () => {
      const res = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Logout failed");
      return data;
    },

    getMe: async () => {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch profile");
      return data;
    },
  },

  // Scores endpoints
  scores: {
    getScores: async () => {
      const res = await fetch(`${API_BASE_URL}/scores`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch scores");
      return data;
    },

    manageScores: async (scoreData) => {
      const res = await fetch(`${API_BASE_URL}/scores/manage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(scoreData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to manage scores");
      return data;
    },
  },

  // Health check
  health: async () => {
    const res = await fetch(`${API_BASE_URL}/health`);
    const data = await res.json();
    return data;
  },
};
