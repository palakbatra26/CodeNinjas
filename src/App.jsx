// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from '../Firebase'; // Corrected import path
import Signupp from "./components/Signupp";

import Login from './components/Login';
import StoryGenerator from './components/StoryGenerator';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/Signupp" element={user ? <Navigate to="/generator" /> : <Signupp />} />
        <Route path="/login" element={user ? <Navigate to="/generator" /> : <Login />} />
        <Route path="/generator" element={user ? <StoryGenerator /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/generator" />} />
      </Routes>
    </Router>
  );
}

export default App;