import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from 'v2/components/ProtectedRoute';
import AuthLayouts from 'v2/layouts/AuthLayouts';
import PageLayouts from 'v2/layouts/PageLayouts';
import {
  AccommodationPage,
  ClientListPage, ClientPage, DayoffListPage, HomePage, LoginPage,
  PrepaymentListPage, ProfileAdminPage, ProfileListPage, RegisterPage,
} from 'v2/pages';

import NavbarStateProvider from 'contexts/NavbarStateContext';
import NotificationProvider from 'contexts/NotificationContext';
import { UserRole } from 'interfaces/users.interface';
import CreateNotificationPage from 'pages/CreateNotificationPage';
import CustomizationPage from 'pages/CustomizationPage';
import DayoffPage from 'pages/DayoffPage';
import ExportResidencesPage from 'pages/ExportResidencesPage';
import NotFoundPage from 'pages/NotFoundPage';
import NotificationsPage from 'pages/NotificationsPage';
import PaychecksPage from 'pages/PaychecksPage';
import PaychecksUploadPage from 'pages/PaychecksUploadPage';
import PrepaymentPage from 'pages/PrepaymentPage';
import ProfilePage from 'pages/ProfilePage';
import ProjectListPage from 'pages/ProjectListPage';
import UploadProfilesPage from 'pages/UploadProfilesPage';

const ALL_ROLES: UserRole[] = ['admin', 'recruiter', 'super-admin', 'user'];
const FULL_PERMISSION_ROLES: UserRole[] = ['admin', 'recruiter', 'super-admin'];

export default function Router () {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <NavbarStateProvider>
          <Routes>
            <Route path="*" element={<NotFoundPage />} />
            <Route element={<AuthLayouts />}>
              <Route path="/login" element={<LoginPage />}/>
              <Route path="/sign-up" element={<RegisterPage />}/>
            </Route>
            <Route element={<ProtectedRoute matchedRoles={ALL_ROLES} />}>
              <Route element={<PageLayouts />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
              </Route>
            </Route>
            <Route element={<ProtectedRoute matchedRoles={FULL_PERMISSION_ROLES} />}>
              <Route element={<PageLayouts />}>
                <Route path="/projects" element={<ProjectListPage />} />
                <Route path="/prepayments" element={<PrepaymentListPage />} />
                <Route path="/daysoff" element={<DayoffListPage />} />
                <Route path="/paychecks-upload" element={<PaychecksUploadPage />} />
                <Route path="/create-notification" element={<CreateNotificationPage />} />
                <Route path="/import-profiles" element={<UploadProfilesPage />} />
                <Route path="/create-profile" element={<ProfilePage />} />
                <Route path="/customization" element={<CustomizationPage />} />
                <Route path="/accommodation" element={<AccommodationPage />} />
                <Route path="/export-residences" element={<ExportResidencesPage />} />
                <Route path="/clients" element={<ClientListPage />} />
                <Route path="/client/:id" element={<ClientPage />} />
              </Route>
            </Route>
            <Route element={<ProtectedRoute matchedRoles={['admin', 'recruiter']} />}>
              <Route element={<PageLayouts />}>
                <Route path="/profiles" element={<ProfileListPage />} />
                <Route path="/profile/:id" element={<ProfileAdminPage />} />
              </Route>
            </Route>
            <Route element={<ProtectedRoute matchedRoles={['user']} />}>
              <Route element={<PageLayouts />}>
                <Route path="/prepayment" element={<PrepaymentPage />} />
                <Route path="/dayoff" element={<DayoffPage />} />
                <Route path="/paychecks" element={<PaychecksPage />} />
              </Route>
            </Route>
          </Routes>
        </NavbarStateProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}
