import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from 'components/shared/ProtectedRoute/ProtectedRoute';
import HomePage from 'pages/HomePage';
import LoginPage from 'pages/LoginPage';
import PrepaymentPage from 'pages/PrepaymentPage';
import DayoffPage from 'pages/DayoffPage';
import NotificationsPage from 'pages/NotificationsPage';
import PaychecksPage from 'pages/PaychecksPage';
import ProfilePage from 'pages/ProfilePage';

export default function Router () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/prepayment" element={<ProtectedRoute><PrepaymentPage /></ProtectedRoute>} />
        <Route path="/dayoff" element={<ProtectedRoute><DayoffPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/paychecks" element={<ProtectedRoute><PaychecksPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </BrowserRouter>
  );
}
