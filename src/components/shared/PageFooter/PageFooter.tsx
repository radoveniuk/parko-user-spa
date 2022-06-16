import React from 'react';
import { useTranslation } from 'react-i18next';

import { FooterWrapper } from './styles';

type Props = {
  children?: React.ReactNode;
}

const PageHeader = ({ children }: Props) => {
  const { t } = useTranslation();
  return (
    <FooterWrapper>
      <h3 className="title">{t('footer.contacts')}</h3>
      <div className="content">
        <div className="contactsInfo">
          <p className="infoText">{t('footer.contactsInfo')}</p>
        </div>
        <ul className="contactsList">
          <li><a href ="mailto:support@parko.sk">support@parko.sk</a></li>
          <li><a href="https://parko-staff.com/">parko-staff.com</a></li>
          <li><a href="tel:+421950759277">+421950759277</a></li>
        </ul>
      </div>
      {children}
    </FooterWrapper>
  );
};

export default PageHeader;
