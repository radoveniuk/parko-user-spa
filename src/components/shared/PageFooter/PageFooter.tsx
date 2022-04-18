import React from 'react';
import { useTranslation } from 'react-i18next';

import { FooterWrapper } from './styles';

const PageHeader = () => {
  const { t } = useTranslation();
  return (
    <FooterWrapper>
      <div className="contactsInfo">
        <h3 className="title">{t('footer.contacts')}</h3>
        <p className="infoText">{t('footer.contactsInfo')}</p>
      </div>
      <ul className="contactsList">
        <li><a href ="mailto:support@parko.sk">support@parko.sk</a></li>
        <li><a href="https://parko-staff.com/">parko-staff.com</a></li>
        <li><a href="tel:+421950759277">+421950759277</a></li>
      </ul>
    </FooterWrapper>
  );
};

export default PageHeader;
