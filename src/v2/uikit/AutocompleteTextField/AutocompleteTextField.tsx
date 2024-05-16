import React, { ChangeEvent, FocusEvent, ForwardedRef, forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { List, ListItem, Paper, Popper } from '@mui/material';

import Input, { InputProps } from '../Input';

export type AutocompleteTextFieldProps = InputProps & {
  options: string[];
  onChange?(v: string): void;
}

const AutocompleteTextField = ({
  onChange, value: defaultValue = '',
  options, ...rest
}: AutocompleteTextFieldProps, ref: ForwardedRef<HTMLInputElement>) => {
  const [inputValue, setInputValue] = useState<string>(defaultValue as string);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    onChange?.(event.target.value);
  }, [onChange]);

  const handleOpen = useCallback((event: FocusEvent<HTMLInputElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleSelectOption = useCallback((option: string) => () => {
    setInputValue(option);
    setAnchorEl(null);
    setAnchorEl(null);
    onChange?.(option);
  }, [onChange]);

  const filteredOptions = useMemo(() => options.filter((option) => option.toLowerCase().includes(inputValue.toLowerCase())), [inputValue, options]);

  const popperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClosePopper = (event: MouseEvent) => {
      if (popperRef.current && anchorEl && !popperRef.current.contains(event.target as Node) && !anchorEl.contains(event.target as Node)) {
        setAnchorEl(null);
      }
    };

    document.addEventListener('mousedown', handleClosePopper);

    return () => {
      document.removeEventListener('mousedown', handleClosePopper);
    };
  }, [anchorEl]);

  return (
    <>
      <Input
        {...rest}
        value={inputValue}
        onChange={handleChange}
        onFocus={handleOpen}
        ref={ref}
      />
      <Popper
        ref={popperRef}
        open={Boolean(anchorEl && filteredOptions.length)}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ zIndex: 2000, width: anchorEl ? anchorEl.clientWidth : undefined }}
        disablePortal
      >
        <Paper>
          <List>
            {filteredOptions
              .map((option, index) => (
                <ListItem key={index} onClick={handleSelectOption(option)} button>
                  {option}
                </ListItem>
              ))}
          </List>
        </Paper>
      </Popper>
    </>
  );
};

export default memo(forwardRef(AutocompleteTextField));
