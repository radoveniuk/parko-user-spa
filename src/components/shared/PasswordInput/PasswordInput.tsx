import React, { ForwardedRef, forwardRef, useState } from 'react';
import { TextFieldProps } from '@mui/material';
import IconButton from 'v2/uikit/IconButton';

import { EyeIcon, EyeSlashIcon } from 'components/icons';
import Input from 'components/shared/Input';

const PasswordInput = forwardRef((props: TextFieldProps, ref: ForwardedRef<HTMLInputElement>) => {
  const [show, setShow] = useState(false);
  return (
    <Input
      {...props}
      type={show ? 'text' : 'password'}
      ref={ref}
      InputProps={{
        endAdornment: (
          <IconButton onClick={() => void setShow((prev) => !prev)}>
            {show ? <EyeIcon /> : <EyeSlashIcon />}
          </IconButton>
        ),
      }} />
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
