import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from 'v2/components/ProtectedRoute';
import AuthLayouts from 'v2/layouts/AuthLayouts';
import PageLayouts from 'v2/layouts/PageLayouts';
import {
  AccommodationPage,
  ClientListPage, ClientPage, CustomFormFieldsPage,
  CustomFormsPage,
  CustomUserFieldsPage,
  DayoffListPage, DocsTemplatesPage,
  HomePage, LoginPage, NotFoundPage,
  OrderListPage,
  OrderPage,
  PrepaymentListPage, ProfileAdminPage, ProfileListPage, RegisterPage,
  RolesPage,
} from 'v2/pages';

import NavbarStateProvider from 'contexts/NavbarStateContext';
import NotificationProvider from 'contexts/NotificationContext';
import CreateNotificationPage from 'pages/CreateNotificationPage';
import DayoffPage from 'pages/DayoffPage';
import ExportResidencesPage from 'pages/ExportResidencesPage';
import NotificationsPage from 'pages/NotificationsPage';
import PaychecksPage from 'pages/PaychecksPage';
import PaychecksUploadPage from 'pages/PaychecksUploadPage';
import PrepaymentPage from 'pages/PrepaymentPage';
import ProfilePage from 'pages/ProfilePage';
import UploadProfilesPage from 'pages/UploadProfilesPage';

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
            <Route element={<PageLayouts />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route element={<ProtectedRoute permission="notifications:read" />}>
                <Route path="/notifications" element={<NotificationsPage />} />
              </Route>
              <Route element={<ProtectedRoute permission="prepayments:read" />}>
                <Route path="/prepayments" element={<PrepaymentListPage />} />
              </Route>
              <Route element={<ProtectedRoute permission="daysoff:read" />}>
                <Route path="/daysoff" element={<DayoffListPage />} />
              </Route>
              <Route element={<ProtectedRoute permission="paychecks:read" />}>
                <Route path="/paychecks-upload" element={<PaychecksUploadPage />} />
              </Route>
              <Route element={<ProtectedRoute permission="notifications:create" />}>
                <Route path="/create-notification" element={<CreateNotificationPage />} />
              </Route>
              <Route element={<ProtectedRoute permission="users:create" />}>
                <Route path="/import-profiles" element={<UploadProfilesPage />} />
              </Route>
              <Route element={<ProtectedRoute permission="customFields:read" />}>
                <Route path="/customization/fields" element={<CustomFormFieldsPage />} />
              </Route>
              <Route element={<ProtectedRoute permission="customFields:read" />}>
                <Route path="/customization/forms" element={<CustomFormsPage />} />
              </Route>
              <Route element={<ProtectedRoute permission="roles:read" />}>
                <Route path="/customization/roles" element={<RolesPage />} />
              </Route>
              <Route element={<ProtectedRoute permission="customFields:read" />}>
                <Route path="/customization/users" element={<CustomUserFieldsPage />} />
              </Route>
              <Route element={<ProtectedRoute permission="docsTemplates:read" />}>
                <Route path="/customization/docs-templates" element={<DocsTemplatesPage />} />
              </Route>
              <Route element={<ProtectedRoute permission="accommodations:read" />}>
                <Route path="/accommodation" element={<AccommodationPage />} />
              </Route>
              <Route element={<ProtectedRoute permission="residences:read" />}>
                <Route path="/export-residences" element={<ExportResidencesPage />} />
              </Route>
              <Route element={<ProtectedRoute permission="clients:read" />}>
                <Route path="/clients" element={<ClientListPage />} />
              </Route>
              <Route element={<ProtectedRoute permission="clients:read" />}>
                <Route path="/client/:id" element={<ClientPage />} />
              </Route>
              <Route element={<ProtectedRoute permission="orders:read" />}>
                <Route path="/orders" element={<OrderListPage />} />
              </Route>
              <Route element={<ProtectedRoute permission="orders:read" />}>
                <Route path="/order/:id" element={<OrderPage />} />
              </Route>
              <Route element={<ProtectedRoute permission="users:read" />}>
                <Route path="/profiles" element={<ProfileListPage />} />
              </Route>
              <Route element={<ProtectedRoute permission="users:read" />}>
                <Route path="/profile/:id" element={<ProfileAdminPage />} />
              </Route>
              <Route element={<ProtectedRoute permission="user:prepayments" />}>
                <Route path="/prepayment" element={<PrepaymentPage />} />
              </Route>
              <Route element={<ProtectedRoute permission="user:daysoff" />}>
                <Route path="/dayoff" element={<DayoffPage />} />
              </Route>
              <Route element={<ProtectedRoute permission="user:paychecks" />}>
                <Route path="/paychecks" element={<PaychecksPage />} />
              </Route>
            </Route>
          </Routes>
        </NavbarStateProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}
