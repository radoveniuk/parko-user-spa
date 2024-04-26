import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Menu, MenuItem } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';
import ListTableHeader from 'v2/uikit/ListTableHeader';

import { ArrowDownIcon, ThreeDotsIcon } from 'components/icons';

const HeaderTable = ({ selectedItems, setSelectedItems, setOpenPrintDialog, data, customFields }: any) => {
  const { t } = useTranslation();

  return (
    <>
      <ListTableHeader title={`${t('client.profiles')}: ${data.length}`}>
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
      </ListTableHeader>
    </>
  );
};

export default memo(HeaderTable);
