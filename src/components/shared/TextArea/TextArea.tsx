import React, { ForwardedRef, forwardRef, HTMLProps } from 'react';
import { TextAreaWrapper } from './styles';

type Props = HTMLProps<HTMLTextAreaElement> & {
  title: string;
}

const TextArea = forwardRef(({ title, ...rest }: Props, ref: ForwardedRef<HTMLTextAreaElement>) => {
  return (
    <TextAreaWrapper>
      <textarea
        className="material-textarea"
        ref={ref}
        placeholder=" "
        {...rest}
      />
      <label className="material-textarea-label">{title}</label>
    </TextAreaWrapper>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
