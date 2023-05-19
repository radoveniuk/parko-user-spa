import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from 'v2/uikit';

import { AiOutlineSearchIcon } from 'components/icons';

import { SearchWrapper } from './styles';

const SearchBar = () => {
  const { t } = useTranslation();

  return (
    <SearchWrapper>
      <Input placeholder={t('header.search')} InputProps={{
        startAdornment: (
          <div className="search-icon">
            <AiOutlineSearchIcon />
          </div>
        ),
      }} />
    </SearchWrapper>
  );
};

export default SearchBar;
