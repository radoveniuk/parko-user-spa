import React, { useEffect } from 'react';
import Navbar from 'components/Menu/Navbar';
import PageHeader from '../PageHeader';
import PageFooter from '../PageFooter';
import { PageContent, PageWrapper } from './styles';

type Props = {
  showNavbar?: boolean;
  children: React.ReactNode;
  title?: string;
}

const DEFAULT_TITLE = 'Parko User — Personal Managment System by Parko Staff';

const Page = ({ showNavbar = true, title, children }: Props) => {
  useEffect(() => {
    if (title) {
      document.title = `Parko user - ${title}`;
    } else {
      document.title = DEFAULT_TITLE;
    }
  }, [title]);

  return (
    <PageWrapper>
      {showNavbar && <Navbar />}
      <PageContent>
        <PageHeader />
        {children}
        <PageFooter />
      </PageContent>
    </PageWrapper>
  );
};

export default Page;
