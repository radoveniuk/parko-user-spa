import React, { useEffect } from 'react';
import { useIsFetching, useIsMutating } from 'react-query';

import LanguageSelector from 'components/complex/LanguageSelector';
import Navbar, { ToggleNavbarButton } from 'components/Menu/Navbar';
import useViewportWdth from 'hooks/useViewportWdth';

import PageFooter from '../PageFooter';
import PageHeader from '../PageHeader';

import { PageContent, PageLoader, PageWrapper } from './styles';

type Props = {
  showNavbar?: boolean;
  children: React.ReactNode;
  title?: string;
}

const DEFAULT_TITLE = 'Parko User — Personal Managment System by Parko Staff';

const langBreakpoint = 790;

const Page = ({ showNavbar = true, title, children }: Props) => {
  const width = useViewportWdth();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

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
        {width <= langBreakpoint && showNavbar && (
          <PageHeader>
            <ToggleNavbarButton />
          </PageHeader>
        )}
        <section className="content-wrapper">
          {(!!isFetching || !!isMutating) && <PageLoader />}
          {children}
        </section>
        {width <= langBreakpoint && (
          <PageFooter>
            <LanguageSelector className="page-actions" />
          </PageFooter>
        )}
      </PageContent>
    </PageWrapper>
  );
};

export default Page;
