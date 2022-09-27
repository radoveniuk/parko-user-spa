import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import api from 'api/common';
import Input from 'components/shared/Input';
import useDebounce from 'hooks/useDebounce';
import useOutsideClick from 'hooks/useOutsideClick';
import { MongoEntity } from 'interfaces/base.types';

import { SearchWrapper } from './styles';

export type SearchProps<T> = {
  url?: string;
  dataList?: T[];
  searchFields?: (keyof Partial<T>)[];
  onSelect(item: T): void;
  searchItemComponent: ((item: T) => string | React.ReactNode);
  closeAfterSelect?: boolean;
  placeholder?: string;
};

const Search = <T extends MongoEntity>({
  url, dataList, searchFields, searchItemComponent, onSelect, closeAfterSelect = true, placeholder,
}: SearchProps<T>) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState<string>('');
  const debouncedSearchValue = useDebounce(searchValue);

  const [touched, setTouched] = useState(false);

  const [openSearchBox, setOpenSeacrhBox] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  useOutsideClick(searchBoxRef, () => {
    setOpenSeacrhBox(false);
  });

  const { data = [], refetch } = useQuery<T[]>(
    ['search', url],
    () => api.get(url || '', { params: { search: searchValue } }).then((res) => res.data.data),
    { enabled: !!url && touched },
  );

  const searchResult = useMemo(() => {
    if (url && debouncedSearchValue.trim().length >= 3) return data;

    if (!dataList || !searchFields || !debouncedSearchValue) return [];

    return dataList.filter((item) => {
      let matched = false;
      searchFields.forEach((searchField) => {
        if (typeof item[searchField] === 'string' && item[searchField].toLowerCase().includes(debouncedSearchValue.toLowerCase())) {
          matched = true;
        }
      });
      return matched;
    });
  }, [data, dataList, searchFields, debouncedSearchValue, url]);

  const search = useCallback(() => {
    if (url) {
      touched ? refetch() : setTouched(true);
    }
  }, [refetch, touched, url]);

  useEffect(() => {
    if (debouncedSearchValue) {
      setOpenSeacrhBox(true);
    }
    if (debouncedSearchValue.trim().length >= 3) {
      search();
    }
  }, [debouncedSearchValue, search]);

  return (
    <SearchWrapper ref={searchBoxRef}>
      <Input
        placeholder={placeholder || t('search')}
        value={searchValue}
        onChange={(e) => void setSearchValue(e.target.value)}
        onClick={() => void setOpenSeacrhBox(true)}
        className="search-input"
      />
      {openSearchBox && (
        <div className="search-results">
          {searchResult.map((item) => (
            <div
              key={item._id}
              role="button"
              className="search-result-item"
              onClick={() => {
                closeAfterSelect && setOpenSeacrhBox(false);
                onSelect(item);
              }}
            >
              {searchItemComponent(item)}
            </div>
          ))}
        </div>
      )}
    </SearchWrapper>
  );
};

export default Search;
