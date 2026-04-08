import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ambil session user saat aplikasi pertama kali dimuat (Offline capability)
  useEffect(() => {
    const savedUser = localStorage.getItem("todo_current_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Di dalam AuthProvider
  const login = (email, password) => {
    const allUsers = JSON.parse(localStorage.getItem("todo_users") || "[]");
    const existingUser = allUsers.find((u) => u.email === email);

    if (existingUser) {
      if (password === null || existingUser.password === password) {
        // BERHASIL: Simpan ke state dan localStorage
        const sessionData = { email: existingUser.email };
        localStorage.setItem("todo_current_user", JSON.stringify(sessionData));
        setUser(sessionData); // <-- Ini yang memicu pindah halaman
        return { success: true };
      }
      return { success: false, message: "Password is incorrect" };
    } else {
      // USER BARU: Daftarkan otomatis
      const newUser = { email, password };
      allUsers.push(newUser);
      localStorage.setItem("todo_users", JSON.stringify(allUsers));

      const sessionData = { email: newUser.email };
      localStorage.setItem("todo_current_user", JSON.stringify(sessionData));
      setUser(sessionData); // <-- Ini yang memicu pindah halaman
      return { success: true };
    }
  };

  const saveSession = (userData) => {
    localStorage.setItem("todo_current_user", JSON.stringify(userData));
    setUser(userData);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem("todo_current_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
