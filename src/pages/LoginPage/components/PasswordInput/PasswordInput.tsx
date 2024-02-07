import React, { ForwardedRef, forwardRef, HTMLProps, useState } from 'react';

import { EyeIcon, EyeSlashIcon } from 'components/icons';
import IconButton from 'v2/uikit/IconButton';

import { PasswordInputWrapper } from './styles';

const PasswordInput = forwardRef((props: HTMLProps<HTMLInputElement>, ref: ForwardedRef<HTMLInputElement>) => {
  const [show, setShow] = useState(false);
  return (
    <PasswordInputWrapper>
      <input {...props} type={show ? 'text' : 'password'} ref={ref} />
      <IconButton onClick={() => void setShow((prev) => !prev)}>
        {show ? <EyeIcon /> : <EyeSlashIcon />}
      </IconButton>
    </PasswordInputWrapper>
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
