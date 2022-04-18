import React from 'react';
import AppHeader from '../AppHeader';
import Navbar, { NavItem, NavItemIcon, NavItemText } from '../../Menu/Navbar';
import { PageContent, PageWrapper } from './styles';
import { NAVBAR_ITEMS } from 'constants/menu';
import { useTranslation } from 'react-i18next';
import LanguageSelector from 'components/complex/LanguageSelector';

type Props = {
  showNavbar?: boolean;
  children: React.ReactNode;
}

const Page = ({ showNavbar = true, children }: Props) => {
  const { t } = useTranslation();
  return (
    <PageWrapper>
      {showNavbar && (
        <Navbar>
          {NAVBAR_ITEMS.map((item) => (
            <NavItem key={item.title} to={item.to}>
              <NavItemIcon>
                {item.icon}
              </NavItemIcon>
              <NavItemText>{t(item.title)}</NavItemText>
            </NavItem>
          ))}
          <LanguageSelector />
        </Navbar>
      )}
      <PageContent>
        <AppHeader />
        {children}
      </PageContent>
    </PageWrapper>
  );
};

export default Page;
