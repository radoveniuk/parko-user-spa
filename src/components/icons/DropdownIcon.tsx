import React from 'react';

type Props = {
  size?: number;
  color?: string;
};

export const DropdownIcon = ({ size = 12, color = '#131313', ...rest }: Props) => (
  <svg width={size} height={size / 2} viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path fillRule="evenodd" clipRule="evenodd" d="M11.7225 0.23964C12.0925 0.55916 12.0925 1.0772 11.7225 1.39672L6.66989 5.76036C6.29992 6.07988 5.70008 6.07988 5.33011 5.76036L0.277478 1.39672C-0.0924926 1.0772 -0.0924926 0.55916 0.277478 0.23964C0.647448 -0.0798796 1.24729 -0.0798797 1.61726 0.23964L6 4.02473L10.3827 0.23964C10.7527 -0.07988 11.3526 -0.07988 11.7225 0.23964Z" fill={color}/>
  </svg>
);
