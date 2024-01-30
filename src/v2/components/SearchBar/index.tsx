import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import isEmpty from 'lodash-es/isEmpty';
import { Input } from 'v2/uikit';

import { useGetSearchResults } from 'api/query/searchQueary';
import { AiOutlineSearchIcon } from 'components/icons';
import useDebounce from 'hooks/useDebounce';
import useOutsideClick from 'hooks/useOutsideClick';
import { IClient } from 'interfaces/client.interface';

import { SearchWrapper } from './styles';

const SearchBar = () => {
  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue);
  const { data, remove } = useGetSearchResults(debouncedSearch);

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
      <Input
        value={searchValue}
        onClick={() => void setOpenSearchMenu(true)}
        onChange={(e) => void setSearchValue(e.target.value)}
        placeholder={t('header.search')}
        InputProps={{
          startAdornment: (
            <div className="search-icon">
              <AiOutlineSearchIcon />
            </div>
          ),
        }}
      />
      {!!data && openSearchMenu && (
        <div className="results">
          {!isEmpty(data.users) && (
            <>
              <div className="subtitle">{t('navbar.profiles')}:</div>
              {data.users.map((user) => (
                <Link key={user._id} to={`/profile/${user._id}`}>
                  {user.name} {user.surname} ({user.email})
                </Link>
              ))}
            </>
          )}
          {!isEmpty(data.projects) && (
            <>
              <div className="subtitle">{t('navbar.projects')}:</div>
              {data.projects.map((project) => (
                <Link key={project._id} to={`/projects?id=${project._id}`}>
                  {project.client ? `${(project.client as IClient).name} > ` : ''}{project.name}
                </Link>
              ))}
            </>
          )}
          {!isEmpty(data.clients) && (
            <>
              <div className="subtitle">{t('navbar.clients')}:</div>
              {data.clients.map((client) => (
                <Link key={client._id} to={`/client/${client._id}`}>
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
