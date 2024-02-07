import React from 'react';

import { LogoWrapper } from './styles';

const Logo = () => (
  <LogoWrapper>
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_38_60)">
        <path d="M19 22H13C12.4477 22 12 21.5523 12 21V3C12 2.44772 12.4477 2 13 2H31C31.5523 2 32 2.44772 32 3V21C32 21.5523 31.5523 22 31 22H25" stroke="#202124" strokeWidth="4"/>
        <path d="M9 12H3C2.44772 12 2 12.4477 2 13V31C2 31.5523 2.44772 32 3 32H21C21.5523 32 22 31.5523 22 31V13C22 12.4477 21.5523 12 21 12H15" stroke="#2A6AE7" strokeWidth="4"/>
      </g>
      <defs>
        <clipPath id="clip0_38_60">
          <rect width="34" height="34" fill="white"/>
        </clipPath>
      </defs>
    </svg>
    <h1>ParkoUser</h1>
  </LogoWrapper>
);

export default Logo;
