import React from 'react';
import { useTranslation } from 'react-i18next';

import { MainMenuGrid, MainMenuLink } from 'components/Menu/MainMenu';
import Page from 'components/shared/Page';
import { MENU_ITEMS } from 'constants/menu';

const HomePage = () => {
  const { t } = useTranslation();
  return (
    <Page>
      <MainMenuGrid>
        {MENU_ITEMS.map((item) => (
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
