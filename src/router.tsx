import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ProtectedRoute from 'components/shared/ProtectedRoute/ProtectedRoute';
import { useAuthData } from 'contexts/AuthContext';
import NavbarStateProvider from 'contexts/NavbarStateContext';
import NotificationProvider from 'contexts/NotificationContext';
import AccommodationPage from 'pages/AccommodationPage';
import ClientListPage from 'pages/ClientListPage';
import CreateNotificationPage from 'pages/CreateNotificationPage';
import CustomizationPage from 'pages/CustomizationPage';
import DayoffListPage from 'pages/DayoffListPage';
import DayoffPage from 'pages/DayoffPage';
import ExportResidencesPage from 'pages/ExportResidencesPage';
import HomePage from 'pages/HomePage';
import LoginPage from 'pages/LoginPage';
import NotFoundPage from 'pages/NotFoundPage';
import NotificationsPage from 'pages/NotificationsPage';
import PaychecksPage from 'pages/PaychecksPage';
import PaychecksUploadPage from 'pages/PaychecksUploadPage';
import PrepaymentPage from 'pages/PrepaymentPage';
import PrepaymentsListPage from 'pages/PrepaymentsListPage';
import ProfileAdminPage from 'pages/ProfileAdminPage';
import ProfileListPage from 'pages/ProfileListPage';
import ProfilePage from 'pages/ProfilePage';
import ProjectListPage from 'pages/ProjectListPage';
import UploadProfilesPage from 'pages/UploadProfilesPage';

export default function Router () {
  const { role } = useAuthData();

  return (
    <BrowserRouter>
      <NotificationProvider>
        <NavbarStateProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            {role === 'user' && (
              <>
                <Route path="/prepayment" element={<ProtectedRoute><PrepaymentPage /></ProtectedRoute>} />
                <Route path="/dayoff" element={<ProtectedRoute><DayoffPage /></ProtectedRoute>} />
                <Route path="/paychecks" element={<ProtectedRoute><PaychecksPage /></ProtectedRoute>} />
              </>
            )}
            {['admin', 'recruiter'].includes(role as string) && (
              <>
                <Route path="/prepayments" element={<ProtectedRoute><PrepaymentsListPage /></ProtectedRoute>} />
                <Route path="/daysoff" element={<ProtectedRoute><DayoffListPage /></ProtectedRoute>} />
                <Route path="/paychecks-upload" element={<ProtectedRoute><PaychecksUploadPage /></ProtectedRoute>} />
                <Route path="/profiles" element={<ProtectedRoute><ProfileListPage /></ProtectedRoute>} />
                <Route path="/profile/:id" element={<ProtectedRoute><ProfileAdminPage /></ProtectedRoute>} />
                <Route path="/projects" element={<ProtectedRoute><ProjectListPage /></ProtectedRoute>} />
                <Route path="/create-notification" element={<ProtectedRoute><CreateNotificationPage /></ProtectedRoute>} />
                <Route path="/import-profiles" element={<ProtectedRoute><UploadProfilesPage /></ProtectedRoute>} />
                <Route path="/create-profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/customization" element={<ProtectedRoute><CustomizationPage /></ProtectedRoute>} />
                <Route path="/accommodation" element={<ProtectedRoute><AccommodationPage /></ProtectedRoute>} />
                <Route path="/export-residences" element={<ProtectedRoute><ExportResidencesPage /></ProtectedRoute>} />
                <Route path="/clients" element={<ProtectedRoute><ClientListPage /></ProtectedRoute>} />
              </>
            )}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </NavbarStateProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}
