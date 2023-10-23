import React, { memo, ReactNode, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Fade, Paper, Popper } from '@mui/material';
import IconButton from 'v2/uikit/IconButton';

import { CloseIcon, PlusIcon } from 'components/icons';
import { useFilters } from 'components/shared/Filters';

import { Button, MenuToolbar, MenuWrapper, SearchInput } from './styles';

type Filter = {
  id: string;
  name: string;
  popperComponent: (onSelect: (value: any) => void) => ReactNode;
};

type Props = {
  filterOptions: Filter[];
};

const AddFilterButton = ({ filterOptions }: Props) => {
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState<Filter | null>(null);
  const [openPopper, setOpenPopper] = useState(false);
  const anchorEl = useRef<HTMLDivElement>(null);
  const { addFilter } = useFilters();
  const [searchValue, setSearchValue] = useState('');

  const closeFilterMenu = () => {
    setOpenPopper(false);
    setSelectedFilter(null);
  };

  const filteredFilterOptions = useMemo(
    () => filterOptions.filter((filterItem) => filterItem.name.toLowerCase().includes(searchValue.toLowerCase())),
    [filterOptions, searchValue],
  );

  return (
    <>
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
      <Popper style={{ zIndex: 2 }} open={openPopper} anchorEl={anchorEl.current} placement="bottom-start" transition>
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
                    <IconButton color="inherit" onClick={() => void setSelectedFilter(null)}><CloseIcon /></IconButton>
                  </MenuToolbar>
                  <MenuWrapper>
                    {selectedFilter.popperComponent((value) => { closeFilterMenu(); addFilter(selectedFilter.id, value); })}
                  </MenuWrapper>
                </>
              )}
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default memo(AddFilterButton);
