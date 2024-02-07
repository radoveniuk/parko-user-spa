import React, { Fragment, memo, ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Fade, Paper, Popper } from '@mui/material';
import cloneDeep from 'lodash-es/cloneDeep';
import IconButton from 'v2/uikit/IconButton';

import { CloseIcon, PlusIcon } from 'components/icons';
import { useFilters } from 'components/shared/Filters';
import useOutsideClick from 'hooks/useOutsideClick';

import { Button, MenuToolbar, MenuWrapper, SearchInput } from './styles';

type Filter = {
  id: string;
  name: string;
  popperComponent: (onSelect: (value?: any) => void, currentValue?: string) => ReactNode;
};

type Props = {
  filterOptions: Filter[];
};

const AddFilterButton = ({ filterOptions }: Props) => {
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState<Filter | null>(null);
  const [openPopper, setOpenPopper] = useState(false);
  const anchorEl = useRef<HTMLDivElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);
  const { addFilter, filtersState } = useFilters();
  const [searchValue, setSearchValue] = useState('');

  const closeFilterMenu = () => {
    setOpenPopper(false);
    setSelectedFilter(null);
  };

  const closeAndOpenFilterMenu = useCallback(() => {
    const oldFilter = cloneDeep(selectedFilter);
    closeFilterMenu();
    setTimeout(() => {
      setOpenPopper(true);
      setSelectedFilter(oldFilter);
    }, 100);
  }, [selectedFilter]);

  const filteredFilterOptions = useMemo(
    () => filterOptions.filter((filterItem) => filterItem.name.toLowerCase().includes(searchValue.toLowerCase())),
    [filterOptions, searchValue],
  );

  useOutsideClick([anchorEl, popperRef], useCallback(() => {
    closeFilterMenu();
  }, []));

  const onSelectFilter = useCallback((value: string) => {
    if (value && selectedFilter) {
      const oldFilterValue = filtersState?.[selectedFilter.id] || '';
      const newFilterValue = oldFilterValue.length ? [...(new Set([...oldFilterValue.split(','), value]))].toString() : value;
      addFilter(selectedFilter.id, newFilterValue);
    }
    closeAndOpenFilterMenu();
  }, [addFilter, closeAndOpenFilterMenu, filtersState, selectedFilter]);

  return (
    <Fragment>
      <div ref={anchorEl}>
        {!openPopper && (
          <Button
            onClick={(e) => {
              setOpenPopper(prev => !prev);
              setSelectedFilter(null);
            }}
          >
            <PlusIcon size={20} />{t('addFilter')}
          </Button>
        )}
        {!!openPopper && (
          <SearchInput onChange={(e) => void setSearchValue(e.target.value)} value={searchValue} />
        )}
      </div>
      <Popper ref={popperRef} style={{ zIndex: 2 }} open={openPopper} anchorEl={anchorEl.current} placement="bottom-start" transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              {!selectedFilter && (
                <MenuWrapper>
                  {filteredFilterOptions.map((item) => (
                    <div className="filter-item" key={item.name} onClick={() => void setSelectedFilter(item)}>{item.name}</div>
                  ))}
                </MenuWrapper>
              )}
              {!!selectedFilter && (
                <>
                  <MenuToolbar>
                    <span>{selectedFilter.name}</span>
                    <IconButton color="inherit" onClick={closeFilterMenu}><CloseIcon /></IconButton>
                  </MenuToolbar>
                  <MenuWrapper>
                    {selectedFilter.popperComponent(onSelectFilter, filtersState?.[selectedFilter.id])}
                  </MenuWrapper>
                </>
              )}
            </Paper>
          </Fade>
        )}
      </Popper>
    </Fragment>
  );
};

export default memo(AddFilterButton);
