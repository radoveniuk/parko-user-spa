import React, { ForwardedRef, forwardRef, HTMLProps, useId } from 'react';

import Button from '../Button';

import { FileInputWrapper } from './styles';

type Props = HTMLProps<HTMLInputElement> & {
  id?: string;
  label?: string;
  children?: React.ReactNode;
  buttonComponent?: React.ReactNode;
}

const FileInput = forwardRef(({ id, label, children, buttonComponent, disabled, ...rest }: Props, ref: ForwardedRef<HTMLInputElement>) => {
  const fakeId = useId();
  return (
    <FileInputWrapper>
      <label htmlFor={id || fakeId} className="custom-file-upload">
        {!buttonComponent && (
          <>
            <p className="input-label">{label}</p>
            <Button component="span" variant="outlined" disabled={disabled}>{children}</Button>
          </>
        )}
        {buttonComponent}
      </label>
      <input
        {...rest}
        id={id || fakeId}
        ref={ref}
        type="file"
        disabled={disabled}
        hidden
      />
    </FileInputWrapper>
  );
});

FileInput.displayName = 'FileInput';

export default FileInput;
