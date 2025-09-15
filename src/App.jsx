import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatPage from "./pages/ChatPage";
import Auth from "./pages/Auth";
import { useState } from "react";
import { SessionProvider, useSession } from "./context/SessionProvider";
import { Toaster } from "react-hot-toast";

function App() {
  const isAuthenticated = useSession();
  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/chat" /> : <Auth />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/chat" /> : <Auth />}
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/chat" : "/login"} />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
