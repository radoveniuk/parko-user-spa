import React from 'react';
import { Wrapper } from './styles';

type Props = {
  children: React.ReactNode
}

const MainMenuGrid = ({ children }: Props) => (
  <Wrapper>
    {children}
  </Wrapper>
);

export default MainMenuGrid;
