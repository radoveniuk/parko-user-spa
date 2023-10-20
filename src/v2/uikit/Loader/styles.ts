import styled from 'styled-components';

import { themeConfig } from 'theme';

export const LoaderStyledComponent = styled.div`
  position: relative;
  &::after,
  &::before {
  content: "";
  width: 40px;
  height: 40px;
  box-sizing: border-box;
  display: block;
  }
  &::after {
    margin: 0 auto 0 auto;
    border: 4px solid ${themeConfig.palette.primary.main};
    animation: anm-SL-52-rotate2 0.5s infinite ease-in-out;
  }
  &::before {
    margin: 30px auto 0 auto;
    border: 4px solid #000;
    animation: anm-SL-52-rotate1 0.5s infinite ease-in-out;
  }
  @keyframes anm-SL-52-rotate2 {
  0% {
    transform: rotate(0deg);
  }
  50% {
    margin-top: 15px;
  }
  100% {
    transform: rotate(-90deg);
  }
  }
  @keyframes anm-SL-52-rotate1 {
    0% {
    transform: rotate(0deg);
    }
    50% {
      margin-top: 20px;
    }
    100% {
      transform: rotate(90deg);
    }
  }
`;
