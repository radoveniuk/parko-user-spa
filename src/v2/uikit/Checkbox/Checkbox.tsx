import React, { memo } from 'react';
import { CheckboxProps as CheckboxPropsMUI, styled } from '@mui/material';
import CheckboxMUI from '@mui/material/Checkbox';

import { FormControlLabelWrapper } from './styles';

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: 5,
  width: 22,
  height: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#FAFAFA',
  border: '1px solid #D0D0D0',
  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background:
      theme.palette.mode === 'dark' ? 'rgba(57,75,89,.5)' : 'rgba(206,217,224,.5)',
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: '#FAFAFA',
  backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
  '&:before': {
    display: 'block',
    width: 12,
    height: 9,
    // eslint-disable-next-line max-len
    backgroundImage: 'url(\'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.8243 1.1809C11.0586 1.42211 11.0586 1.81318 10.8243 2.05439L5.22426 7.8191C4.98995 8.0603 4.61005 8.0603 4.37574 7.8191L1.17574 4.52498C0.941421 4.28377 0.941421 3.8927 1.17574 3.65149C1.41005 3.41029 1.78995 3.41029 2.02426 3.65149L4.8 6.50887L9.97574 1.1809C10.2101 0.939698 10.5899 0.939698 10.8243 1.1809Z" fill="%232A6AE7" stroke="%232A6AE7" stroke-linecap="round" stroke-linejoin="round"/></svg>\')',
    backgroundRepeat: 'no-repeat',
    content: '""',
  },
});

export type CheckboxProps = CheckboxPropsMUI & {
  label?: string
}
const Checkbox = ({ className, ...props }: CheckboxProps) => (
  <FormControlLabelWrapper
    className={className}
    control={(
      <CheckboxMUI
        sx={{
          '&:hover': { bgcolor: 'transparent' },
        }}
        disableRipple
        color="default"
        checkedIcon={<BpCheckedIcon />}
        icon={<BpIcon />}
        {...props}
      />
    )}
    label={props.label}
  />
);

export default memo(Checkbox);
