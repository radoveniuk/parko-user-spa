import React from 'react';
import { useTranslation } from 'react-i18next';

import { MainMenuGrid, MainMenuLink } from 'components/Menu/MainMenu';
import Page from 'components/shared/Page';
import { ADMIN_MENU_ITEMS, INavbarItem, MENU_ITEMS } from 'constants/menu';
import { useAuthData } from 'contexts/AuthContext';

const HomePage = () => {
  const { t } = useTranslation();
  const { role } = useAuthData();

  let menuItems: INavbarItem[] = [];

  if (role === 'user') {
    menuItems = MENU_ITEMS;
  }
  if (role === 'admin') {
    menuItems = ADMIN_MENU_ITEMS;
  }

  return (
    <Page>
      <MainMenuGrid>
        {menuItems.map((item) => (
          <MainMenuLink key={item.title} to={item.to}>
            <p>{t(item.title)}</p>
            {item.icon}
          </MainMenuLink>
        ))}
      </MainMenuGrid>
    </Page>
  );
};

export default HomePage;
