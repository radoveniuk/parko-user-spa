import React from 'react';

import { DayoffIcon, PaycheckIcon, PrepaymentIcon } from 'components/icons';
import { MainMenuGrid, MainMenuLink } from 'components/Menu/MainMenu';
import AppHeader from 'components/shared/AppHeader';

const HomePage = () => {
  return (
    <div>
      <AppHeader />
      <MainMenuGrid>
        <MainMenuLink to='/prepayments'>
          <p>Запросить аванс</p>
          <PrepaymentIcon size={60} />
        </MainMenuLink>
        <MainMenuLink to='/payslips'>
          <p>Просмотреть расчетные листы</p>
          <PaycheckIcon size={60} />
        </MainMenuLink>
        <MainMenuLink to='/daysoff'>
          <p>Запросить отгул</p>
          <DayoffIcon />
        </MainMenuLink>
      </MainMenuGrid>
    </div>
  );
};

export default HomePage;
