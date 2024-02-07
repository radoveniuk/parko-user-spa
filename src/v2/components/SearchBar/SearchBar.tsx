import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import isEmpty from 'lodash-es/isEmpty';
import pick from 'lodash-es/pick';
import { Input } from 'v2/uikit';

import { useGetSearchResults } from 'api/query/searchQueary';
import { HistoryIcon, SearchIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import useDebounce from 'hooks/useDebounce';
import useLocalStorageState from 'hooks/useLocalStorageState';
import useOutsideClick from 'hooks/useOutsideClick';

import { SearchWrapper } from './styles';

const SearchBar = () => {
  const { t } = useTranslation();
  const { role } = useAuthData();

  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue);
  const { data, remove } = useGetSearchResults(debouncedSearch);
  const [searchbarHistory, setSearchbarHistory] = useLocalStorageState('searchbarHistory');
  const searchbarHistoryState: typeof data = searchbarHistory ? JSON.parse(searchbarHistory) : {};

  const [openSearchMenu, setOpenSearchMenu] = useState(false);
  const searchFieldRef = useRef<HTMLDivElement>(null);

  useOutsideClick(searchFieldRef, useCallback(() => { setOpenSearchMenu(false); }, []));

  const location = useLocation();

  useEffect(() => {
    setOpenSearchMenu(false);
    remove();
    setSearchValue('');
  }, [location, remove]);

  return (
    <SearchWrapper ref={searchFieldRef}>
      {!['user', 'super-admin'].includes(role as string) && (
        <Input
          value={searchValue}
          onClick={() => void setOpenSearchMenu(true)}
          onChange={(e) => void setSearchValue(e.target.value)}
          placeholder={t('header.search')}
          InputProps={{
            startAdornment: (
              <div className="search-icon">
                <SearchIcon />
              </div>
            ),
          }}
        />
      )}
      {!data && openSearchMenu && !isEmpty(searchbarHistoryState) && (
        <div className="results">
          <div className="subtitle"><HistoryIcon />{t('searchHistory')}:</div>
          {!isEmpty(searchbarHistoryState.users) && searchbarHistoryState.users.map((user) => (
            <Link
              key={user._id}
              to={`/profile/${user._id}`}
            >
              {user.name} {user.surname} ({user.email})
            </Link>
          ))}
          {!isEmpty(searchbarHistoryState.clients) && searchbarHistoryState.clients.map((client) => (
            <Link
              key={client._id}
              to={`/client/${client._id}`}
            >
              {client.name} ({client.sidlo})
            </Link>
          ))}
        </div>
      )}
      {!!data && openSearchMenu && (
        <div className="results">
          {isEmpty(data.users) && isEmpty(data.clients) && (
            <div className="subtitle">{t('noData')}</div>
          )}
          {!isEmpty(data.users) && (
            <>
              <div className="subtitle">{t('navbar.profiles')}:</div>
              {data.users.map((user) => (
                <Link
                  key={user._id}
                  to={`/profile/${user._id}`}
                  onClick={() => {
                    const searchbarHistoryState: typeof data = searchbarHistory ? JSON.parse(searchbarHistory) : {};
                    setSearchbarHistory(JSON.stringify({
                      ...searchbarHistoryState,
                      users: [
                        pick(user, ['_id', 'email', 'name', 'surname']),
                        ...(searchbarHistoryState?.users || []).filter(userItem => userItem._id !== user._id),
                      ],
                    }));
                  }}
                >
                  {user.name} {user.surname} ({user.email})
                </Link>
              ))}
            </>
          )}
          {!isEmpty(data.clients) && (
            <>
              <div className="subtitle">{t('navbar.clients')}:</div>
              {data.clients.map((client) => (
                <Link
                  key={client._id}
                  to={`/client/${client._id}`}
                  onClick={() => {
                    const searchbarHistoryState: typeof data = searchbarHistory ? JSON.parse(searchbarHistory) : {};
                    setSearchbarHistory(JSON.stringify({
                      ...searchbarHistoryState,
                      clients: [
                        pick(client, ['_id', 'name', 'sidlo']),
                        ...(searchbarHistoryState?.clients || []).filter(clientItem => clientItem._id !== client._id),
                      ],
                    }));
                  }}

                >
                  {client.name} ({client.sidlo})
                </Link>
              ))}
            </>
          )}
        </div>
      )}
    </SearchWrapper>
  );
};

export default SearchBar;
