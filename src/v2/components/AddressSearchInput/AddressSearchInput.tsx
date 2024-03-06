import React, { ForwardedRef, forwardRef, memo, useEffect, useState } from 'react';
import { ClickAwayListener, MenuItem, MenuList } from '@mui/material';
import Input, { InputProps } from 'v2/uikit/Input';

import api from 'api/common';
import { AddressSuggestion, useGetSuggestions } from 'api/query/addressApiQuery';

import { AddressSearchInputWrapper } from './styles';

type Props = {
  country?: string;
} & InputProps;

const AddressSearchInput = ({ country, value, onChange, ...props }: Props, ref: ForwardedRef<HTMLInputElement>) => {
  const [inputValue, setInputValue] = useState(value as string || '');
  const { data: suggestions } = useGetSuggestions(inputValue, country, { enabled: inputValue.length > 3 });

  const [open, setOpen] = useState(false);
  const [selectedSuggestionItem, setSelectedSuggestionItem] = useState<AddressSuggestion | null>(null);

  useEffect(() => {
    if (selectedSuggestionItem?.place_id) {
      api({ method: 'get', url: `/api/address/google-details/${selectedSuggestionItem.place_id}` }).then(({ data }) => {
        setInputValue(data.data.description);
        onChange?.({
          target: {
            value: data.data.description,
          },
        } as any);
      });
    } else if (selectedSuggestionItem?.description) {
      setInputValue(selectedSuggestionItem.description);
      onChange?.({
        target: {
          value: selectedSuggestionItem.description,
        },
      } as any);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSuggestionItem]);

  return (
    <ClickAwayListener onClickAway={() => { setOpen(false); }}>
      <AddressSearchInputWrapper>
        <Input
          {...props}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            onChange?.(e);
          }}
          ref={ref}
          onClick={() => void setOpen(true)}
        />
        {!!suggestions?.length && open && (
          <div className="suggestions">
            <MenuList>
              {suggestions.map((suggestionItem, index) => (
                <MenuItem key={index} onClick={() => { setSelectedSuggestionItem(suggestionItem); setOpen(false); }}>
                  <div className="content" title={suggestionItem.description}>
                    {suggestionItem.description}
                  </div>
                </MenuItem>
              ))}
            </MenuList>
          </div>
        )}
      </AddressSearchInputWrapper>
    </ClickAwayListener>
  );
};

export default memo(forwardRef(AddressSearchInput));
