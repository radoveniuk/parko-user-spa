import React from 'react';
import { useTranslation } from 'react-i18next';

import { MainMenuGrid, MainMenuLink } from 'components/Menu/MainMenu';
import Page from 'components/shared/Page';
import { ADMIN_MENU_ITEMS, INavbarItem, MENU_ITEMS } from 'constants/menu';
import { useAuthData } from 'contexts/AuthContext';
import { NoDataWrapper } from './styles';

const HomePage = () => {
  const { t } = useTranslation();
  const { role, isVerified } = useAuthData();

  let menuItems: INavbarItem[] = [];

  if (role === 'user' && isVerified) {
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
      {!isVerified && <NoDataWrapper>{t('youNotVerified')}</NoDataWrapper>}
    </Page>
  );
};

export default HomePage;
