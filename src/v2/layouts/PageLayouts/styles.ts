import styled from 'styled-components';

export const MainWrapper = styled.main`
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  padding-right: 12px;

  @media (min-width: 1024px) {
    padding: 0 25px;
  }
`;
