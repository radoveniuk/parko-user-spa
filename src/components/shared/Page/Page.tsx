import React, { useEffect, useState } from 'react';

import Navbar, { ToggleNavbarButton } from 'components/Menu/Navbar';
import LanguageSelector from 'components/complex/LanguageSelector';
import useViewportWdth from 'hooks/useViewportWdth';

import PageHeader from '../PageHeader';
import PageFooter from '../PageFooter';

import { PageContent, PageWrapper } from './styles';

type Props = {
  showNavbar?: boolean;
  children: React.ReactNode;
  title?: string;
}

const DEFAULT_TITLE = 'Parko User — Personal Managment System by Parko Staff';

const langBreakpoint = 790;

const Page = ({ showNavbar = true, title, children }: Props) => {
  const [toggledNavbar, setToggledNavbar] = useState(false);
  const width = useViewportWdth();

  const toggleNavbar = () => void setToggledNavbar((prev) => !prev);

  useEffect(() => {
    if (title) {
      document.title = `Parko user - ${title}`;
    } else {
      document.title = DEFAULT_TITLE;
    }
  }, [title]);

  return (
    <PageWrapper>
      {showNavbar && <Navbar open={toggledNavbar} onClose={toggleNavbar} />}
      <PageContent>
        <PageHeader>
          {showNavbar && <ToggleNavbarButton onClick={toggleNavbar} />}
          {width > langBreakpoint && <LanguageSelector className="language-selector" />}
        </PageHeader>
        <section className="content-wrapper">
          {children}
        </section>
        <PageFooter>
          {width <= langBreakpoint && <LanguageSelector className="language-selector" />}
        </PageFooter>
      </PageContent>
    </PageWrapper>
  );
};

export default Page;
