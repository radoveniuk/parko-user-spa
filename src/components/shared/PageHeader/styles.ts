import styled from 'styled-components';

export const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  
  &:has(.toggle-menu-icon) {
    height: 60px;
    position: sticky;
    top: 0;
    background-color: #fff;
    z-index: 10;
  }

  a {
    display: flex;
    justify-content: center;
    width: min-content;
    margin: 30px auto;
    align-items: center;
    gap: 15px;
  }
`;

export const HeaderText = styled.h1`
  font-size: 30px;
  color: #30384F;
  margin: 0;
  font-weight: 400;
`;

export const HeaderLogo = styled.img`
  width: 60px;
  height: 60px;
`;
