import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Menu, MenuItem, Stack } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';

import { ArrowDownIcon, ThreeDotsIcon } from 'components/icons';

import { HeaderWrapper } from './styles';

const HeaderTable = ({ selectedItems, setSelectedItems, setOpenPrintDialog, data, customFields }: any) => {
  const { t } = useTranslation();

  return (
    <>
      <HeaderWrapper>
        <Stack direction="row" gap="9px" alignContent="center">
          <span className="bold">{t('client.profiles')}: {data.length}</span>
        </Stack>
        <Stack direction="row" gap="15px">
          <Menu
            menuComponent={(
              <>
                <Button className="big-btn">
                  <div className="text">{t('fastActions')}</div>
                  <ArrowDownIcon className="big-icon" />
                </Button>
                <IconButton className="small-btn primary"><ThreeDotsIcon size={25} /></IconButton>
              </>
            )}
          >
            <MenuItem onClick={() => void setSelectedItems(data)}>
              {t('selectAll')}
            </MenuItem>
            <MenuItem disabled={!selectedItems.length} onClick={() => void setSelectedItems([])}>
              {t('removeSelect')}
            </MenuItem>
            <MenuItem disabled={!selectedItems.length} onClick={() => void setOpenPrintDialog(true)}>
              {t('docsTemplates.print')}
            </MenuItem>
          </Menu>
        </Stack>
      </HeaderWrapper>
    </>
  );
};

export default memo(HeaderTable);
