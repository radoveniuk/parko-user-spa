import React, { useEffect } from 'react';
import Navbar, { NavItem, NavItemIcon, NavItemText } from '../../Menu/Navbar';
import { PageContent, PageWrapper } from './styles';
import { NAVBAR_ITEMS } from 'constants/menu';
import { useTranslation } from 'react-i18next';
import LanguageSelector from 'components/complex/LanguageSelector';
import PageHeader from '../PageHeader';
import PageFooter from '../PageFooter';
import { useLocation } from 'react-router-dom';

type Props = {
  showNavbar?: boolean;
  children: React.ReactNode;
  title?: string;
}

const Page = ({ showNavbar = true, title, children }: Props) => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    if (title) {
      document.title = `Parko user - ${title}`;
    }
  }, [title]);

  return (
    <PageWrapper>
      {showNavbar && (
        <Navbar>
          {NAVBAR_ITEMS.map((item) => (
            <NavItem key={item.title} to={item.to} active={item.to === location.pathname}>
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
        <PageHeader />
        {children}
        <PageFooter />
      </PageContent>
    </PageWrapper>
  );
};

export default Page;
