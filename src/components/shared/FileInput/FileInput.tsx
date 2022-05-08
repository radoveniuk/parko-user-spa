import React, { ForwardedRef, forwardRef, HTMLProps } from 'react';
import Button from '../Button';
import { FileInputWrapper } from './styles';

type Props = HTMLProps<HTMLInputElement> & {
  id: string;
  label: string;
  children: React.ReactNode;
}

const FileInput = forwardRef(({ id, label, children, ...rest }: Props, ref: ForwardedRef<HTMLInputElement>) => (
  <FileInputWrapper>
    <label htmlFor={id} className="custom-file-upload">
      <p className="input-label">{label}</p>
      <Button component="span" variant="outlined">{children}</Button>
    </label>
    <input
      {...rest}
      id={id}
      ref={ref}
      type="file"
      hidden
    />
  </FileInputWrapper>
));

FileInput.displayName = 'FileInput';

export default FileInput;
