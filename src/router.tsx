import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from 'components/shared/ProtectedRoute/ProtectedRoute';
import HomePage from 'pages/HomePage';
import LoginPage from 'pages/LoginPage';

export default function Router () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
