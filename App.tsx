
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Storefront from './pages/Storefront';
import Admin from './pages/Admin';
import Login from './pages/Login';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for static session
    const session = localStorage.getItem('admin_session');
    if (session === 'true') {
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Storefront />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={isAdmin ? <Admin /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
