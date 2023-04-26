import React from 'react';
import { useTranslation } from 'react-i18next';

import { useGetDashboardData } from 'api/query/dashboardQuery';
import { AccommodationIcon, BusinessIcon, CustomizeIcon, DayoffIcon, PrepaymentIcon, ProjectIcon, UsersIcon } from 'components/icons';
import { MainMenuGrid, MainMenuLink } from 'components/Menu/MainMenu';
import Page, { PageTitle } from 'components/shared/Page';
import { ADMIN_MENU_ITEMS, INavbarItem, MENU_ITEMS } from 'constants/menu';
import { useAuthData } from 'contexts/AuthContext';

import { NoDataWrapper } from './styles';

const DASHBOARD_ROLES: (string | undefined)[] = ['admin', 'recruiter', 'super-admin'];

const HomePage = () => {
  const { t } = useTranslation();
  const { role, isVerified, username } = useAuthData();
  const { data: dashboard } = useGetDashboardData({ exclude: role === 'super-admin' ? ['users'] : [] }, {
    enabled: DASHBOARD_ROLES.includes(role),
  });

  let menuItems: INavbarItem[] = [];

  if (role === 'user' && isVerified) {
    menuItems = MENU_ITEMS;
  }
  if (DASHBOARD_ROLES.includes(role)) {
    menuItems = ADMIN_MENU_ITEMS;
  }

  return (
    <Page>
      <PageTitle>{t('welcomeText')}<i>{username}</i></PageTitle>
      <MainMenuGrid>
        {menuItems.map((item) => (
          <MainMenuLink key={item.title} to={item.to}>
            <p>{t(item.title)}</p>
            {item.icon}
          </MainMenuLink>
        ))}
        {!!dashboard && DASHBOARD_ROLES.includes(role) && (
          <>
            <MainMenuLink to="/profiles">
              <p>{t('navbar.profiles')} ({dashboard.users || 0})</p>
              <UsersIcon size={60} />
            </MainMenuLink>
            <MainMenuLink to="/projects">
              <p>{t('navbar.projects')} ({dashboard.projects})</p>
              <ProjectIcon size={60} />
            </MainMenuLink>
            <MainMenuLink to="/clients">
              <p>{t('navbar.clients')} ({dashboard.clients})</p>
              <BusinessIcon size={60} />
            </MainMenuLink>
            <MainMenuLink to="/prepayments">
              <p>{t('navbar.prepayments')} ({dashboard.prepayments})</p>
              <PrepaymentIcon size={60} />
            </MainMenuLink>
            <MainMenuLink to="/daysoff">
              <p>{t('navbar.daysoff')} ({dashboard.daysoff})</p>
              <DayoffIcon size={60} />
            </MainMenuLink>
            <MainMenuLink to="/accommodation">
              <p>{t('navbar.accommodation')} ({dashboard.accommodations})</p>
              <AccommodationIcon size={60} />
            </MainMenuLink>
            <MainMenuLink to="/customization">
              <p>{t('navbar.customization')}</p>
              <CustomizeIcon size={60} />
            </MainMenuLink>
          </>
        )}
      </MainMenuGrid>
      {!isVerified && <NoDataWrapper>{t('youNotVerified')}</NoDataWrapper>}
    </Page>
  );
};

export default HomePage;
