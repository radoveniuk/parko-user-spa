import React, { memo, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Fade, Paper, Popper } from '@mui/material';

import { PlusIcon } from 'components/icons';

import { Button, MenuWrapper } from './styles';

type Filter = {
  id: string;
  name: string;
  popperComponent: (onSelect: (value: any) => void) => ReactNode;
};

type Props = {
  filterOptions: Filter[];
  onAddFilter:(key: string, value: string | string[]) => void;
};

const AddFilterButton = ({ filterOptions, onAddFilter }: Props) => {
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState<Filter | null>(null);
  const [openPopper, setOpenPopper] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();
  const closeFilterMenu = () => {
    setOpenPopper(false);
    setSelectedFilter(null);
  };
  return (
    <>
      <Button
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
          setOpenPopper(prev => !prev);
          setSelectedFilter(null);
        }}
      >
        <PlusIcon size={20} />{t('addFilter')}
      </Button>
      <Popper style={{ zIndex: 2 }} open={openPopper} anchorEl={anchorEl} placement="bottom-start" transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <MenuWrapper>
                {!selectedFilter && filterOptions.map((item) => (
                  <div className="filter-item" key={item.name} onClick={() => void setSelectedFilter(item)}>{item.name}</div>
                ))}
                {!!selectedFilter && selectedFilter.popperComponent((value) => { closeFilterMenu(); onAddFilter(selectedFilter.id, value); })}
              </MenuWrapper>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default memo(AddFilterButton);
