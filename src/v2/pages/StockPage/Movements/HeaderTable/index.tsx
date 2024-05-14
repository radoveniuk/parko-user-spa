import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Menu, MenuItem } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';
import ListTableHeader from 'v2/uikit/ListTableHeader';

import { CheckInIcon, ExcelIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';

import { MenuItemContent } from './styles';

type Props = {
  count: number;
}

const HeaderTable = ({ count }: Props) => {
  const { t } = useTranslation();
  const { permissions } = useAuthData();

  return (
    <>
      <ListTableHeader title={`${t('stock.movements')}: ${count}`}>
        <div className="link">
          <Menu className="big-btn" isCloseOnMenu>
            {permissions.includes('residences:create') && (
              <MenuItem onClick={() => {}}>
                <MenuItemContent className="btn"><CheckInIcon size={20}/>Check in</MenuItemContent>
              </MenuItem>
            )}
            <Link to="/export-residences">
              <MenuItem color="secondary">
                <MenuItemContent className="export"><ExcelIcon size={20}/>{t('user.export')}</MenuItemContent>
              </MenuItem>
            </Link>
          </Menu>
          {permissions.includes('residences:create') && (
            <IconButton className="small-btn primary" onClick={() => {}}><CheckInIcon size={25} /></IconButton>
          )}
        </div>
      </ListTableHeader>
    </>
  );
};

export default memo(HeaderTable);
