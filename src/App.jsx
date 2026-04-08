import React from "react";
import { useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";

function App() {
  const { user, loading } = useAuth();

  // Jangan tampilkan apa-apa selama mengecek localStorage
  if (loading) return null;

  return (
    <>
      {/* Jika user terisi (setelah login sukses), MainPage akan otomatis muncul */}
      {user ? <MainPage /> : <LoginPage />}
    </>
  );
}

export default App;
