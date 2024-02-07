import React, { ForwardedRef, forwardRef, InputHTMLAttributes, PropsWithChildren, useId } from 'react';

import { FileInputLabel } from './styles';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  id?: string;
  className?: string;
  onChange?(e: React.ChangeEvent<HTMLInputElement>): void;
  multiple?: boolean;
}

const FileInput = forwardRef(({
  id, children, disabled, className, multiple = true, ...rest
}: PropsWithChildren<Props>, ref: ForwardedRef<HTMLInputElement>) => {
  const fakeId = useId();
  return (
    <>
      <FileInputLabel htmlFor={id || fakeId} className={className}>
        {children}
      </FileInputLabel>
      <input
        {...rest}
        id={id || fakeId}
        ref={ref}
        multiple={multiple}
        type="file"
        disabled={disabled}
        hidden
      />
    </>
  );
});

FileInput.displayName = 'FileInput';

export default FileInput;
