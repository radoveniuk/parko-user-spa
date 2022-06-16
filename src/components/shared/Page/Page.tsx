import React, { useEffect, useState } from 'react';
import Navbar, { ToggleNavbarButton } from 'components/Menu/Navbar';
import PageHeader from '../PageHeader';
import PageFooter from '../PageFooter';
import { PageContent, PageWrapper } from './styles';
import LanguageSelector from 'components/complex/LanguageSelector';

type Props = {
  showNavbar?: boolean;
  children: React.ReactNode;
  title?: string;
}

const DEFAULT_TITLE = 'Parko User — Personal Managment System by Parko Staff';

const Page = ({ showNavbar = true, title, children }: Props) => {
  const [toggledNavbar, setToggledNavbar] = useState(false);

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
      {showNavbar && <Navbar toggled={toggledNavbar} />}
      <PageContent>
        <PageHeader>
          {showNavbar && <ToggleNavbarButton onClick={toggleNavbar} />}
          <LanguageSelector className="language-selector" />
        </PageHeader>
        <section className="content-wrapper">
          {children}
        </section>
        <PageFooter />
      </PageContent>
    </PageWrapper>
  );
};

export default Page;
