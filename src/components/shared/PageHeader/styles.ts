import styled from 'styled-components';

export const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
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
  width: 45px;
  height: 45px;
`;
