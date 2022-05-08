import React, { ForwardedRef, forwardRef, HTMLProps } from 'react';
import Button from '../Button';

type Props = HTMLProps<HTMLInputElement> & {
  id: string;
}

const FileInput = forwardRef(({ id, ...rest }: Props, ref: ForwardedRef<HTMLInputElement>) => (
  <>
    <label htmlFor={id} className="custom-file-upload">
      <Button component="span">Upload</Button>
    </label>
    <input
      {...rest}
      id={id}
      ref={ref}
      type="file"
      hidden
    />
  </>
));

FileInput.displayName = 'FileInput';

export default FileInput;
