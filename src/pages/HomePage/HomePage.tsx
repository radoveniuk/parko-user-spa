import React from 'react';

import { DayoffIcon, PaycheckIcon, PrepaymentIcon } from 'components/icons';
import { MainMenuGrid, MainMenuLink } from 'components/Menu/MainMenu';
import Page from 'components/shared/Page';

const HomePage = () => {
  return (
    <Page>
      <MainMenuGrid>
        <MainMenuLink to='/prepayments'>
          <p>Запросить аванс</p>
          <PrepaymentIcon size={60} />
        </MainMenuLink>
        <MainMenuLink to='/paychecks'>
          <p>Расчетные листы</p>
          <PaycheckIcon size={60} />
        </MainMenuLink>
        <MainMenuLink to='/daysoff'>
          <p>Запросить отгул</p>
          <DayoffIcon size={60} />
        </MainMenuLink>
      </MainMenuGrid>
    </Page>
  );
};

export default HomePage;
