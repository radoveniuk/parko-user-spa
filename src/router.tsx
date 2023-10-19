import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from 'v2/components/ProtectedRoute';
import AuthLayouts from 'v2/layouts/AuthLayouts';
import PageLayouts from 'v2/layouts/PageLayouts';
import { HomePage, LoginPage, ProfileAdminPage, ProfileListPage, RegisterPage } from 'v2/pages';

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
import NotFoundPage from 'pages/NotFoundPage';
import NotificationsPage from 'pages/NotificationsPage';
import PaychecksPage from 'pages/PaychecksPage';
import PaychecksUploadPage from 'pages/PaychecksUploadPage';
import PrepaymentPage from 'pages/PrepaymentPage';
import PrepaymentsListPage from 'pages/PrepaymentsListPage';
import ProfilePage from 'pages/ProfilePage';
import ProjectListPage from 'pages/ProjectListPage';
import UploadProfilesPage from 'pages/UploadProfilesPage';

const FULL_PERMISSION_ROLES = ['admin', 'recruiter', 'super-admin'];

export default function Router () {
  const { role } = useAuthData();

  return (
    <BrowserRouter>
      <NotificationProvider>
        <NavbarStateProvider>
          <Routes>
            <Route element={<AuthLayouts />}>
              <Route path="/login" element={<LoginPage />}/>
              <Route path="/sign-up" element={<RegisterPage />}/>
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route element={<PageLayouts />}>
                <Route path="*" element={<NotFoundPage />} />
                <Route path="/" element={<HomePage />}/>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                {['admin', 'recruiter'].includes(role as string) && (
                  <>
                    <Route path="/profiles" element={<ProfileListPage />} />
                    <Route path="/profile/:id" element={<ProfileAdminPage />} />
                  </>
                )}
                {FULL_PERMISSION_ROLES.includes(role as string) && (
                  <>
                    <Route path="/projects" element={<ProjectListPage />} />
                    <Route path="/prepayments" element={<PrepaymentsListPage />} />
                    <Route path="/daysoff" element={<DayoffListPage />} />
                    <Route path="/paychecks-upload" element={<PaychecksUploadPage />} />
                    <Route path="/create-notification" element={<CreateNotificationPage />} />
                    <Route path="/import-profiles" element={<UploadProfilesPage />} />
                    <Route path="/create-profile" element={<ProfilePage />} />
                    <Route path="/customization" element={<CustomizationPage />} />
                    <Route path="/accommodation" element={<AccommodationPage />} />
                    <Route path="/export-residences" element={<ExportResidencesPage />} />
                    <Route path="/clients" element={<ClientListPage />} />
                  </>
                )}
                {role === 'user' && (
                  <>
                    <Route path="/prepayment" element={<PrepaymentPage />} />
                    <Route path="/dayoff" element={<DayoffPage />} />
                    <Route path="/paychecks" element={<PaychecksPage />} />
                  </>
                )}
              </Route>
            </Route>
          </Routes>
        </NavbarStateProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}
