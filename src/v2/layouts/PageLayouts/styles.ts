import styled from 'styled-components';

export const MainWrapper = styled.main`
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;

  @media (min-width: 1024px) {
    padding-right: 25px;
  }
`;
