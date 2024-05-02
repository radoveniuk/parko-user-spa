import React, {
  ChangeEvent,
  ChangeEventHandler,
  forwardRef,
  FunctionComponent,
} from 'react';
import { NumberFormatBase, NumberFormatBaseProps } from 'react-number-format';

interface IBANInputProps extends NumberFormatBaseProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const IBANInputDef: FunctionComponent<IBANInputProps> = ({
  onChange,
  ...props
}) => (
  <NumberFormatBase
    {...props}
    type="text"
    format={(value) =>
      value
        .replace(/\s+/g, '')
        .replace(/([a-z0-9]{4})/gi, '$1 ')
        .trim()
        .toLocaleUpperCase()
    }
    removeFormatting={(value) => value.replace(/\s+/gi, '')}
    isValidInputCharacter={(char) => /^[a-z0-9]$/i.test(char)}
    getCaretBoundary={(value) =>
      Array(value.length + 1)
        .fill(0)
        .map((v) => true)
    }
    onValueChange={(values, { event }) =>
      onChange(
        Object.assign({} as ChangeEvent<HTMLInputElement>, event, {
          target: { name: props.name, value: values.value.toLocaleUpperCase() },
        }),
      )
    }
    onKeyDown={(e) =>
      !/^(?:[a-z0-9]|Backspace|Delete|Home|End|ArrowLeft|ArrowRight|Shift|CapsLock|Control|NumLock|Tab|Paste|Redo|Undo)$/i.test(
        e.key,
      ) && e.preventDefault()
    }
  />
);

export const IBANInput = forwardRef<HTMLInputElement, IBANInputProps>(
  (props, ref) => <IBANInputDef {...props} getInputRef={ref} />,
);

IBANInput.displayName = 'IBANInput';
