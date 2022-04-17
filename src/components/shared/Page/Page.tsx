import { UserIcon } from 'components/icons';
import React from 'react';
import AppHeader from '../AppHeader';
import Navbar, { NavItem } from '../Navbar';
import { PageContent, PageWrapper } from './styles';

type Props = {
  showNavbar?: boolean;
  children: React.ReactNode;
}

const Page = ({ showNavbar = true, children }: Props) => (
  <PageWrapper>
    {showNavbar && (
      <Navbar>
        <NavItem to="/profile">
          <UserIcon />
          <span>Profile</span>
        </NavItem>
      </Navbar>
    )}
    <PageContent>
      <AppHeader />
      {children}
    </PageContent>
  </PageWrapper>
);

export default Page;
