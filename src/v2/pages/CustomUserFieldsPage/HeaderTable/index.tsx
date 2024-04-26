import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, MenuItem } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';
import ListTableHeader from 'v2/uikit/ListTableHeader';

import { FieldIcon, FormIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';

import { BindingDialog } from '../dialogs';
import { SectionsDialog } from '../dialogs/SectionsDialog';

import { MenuItemContent } from './styles';

type Props = {
  count: number;
}

const HeaderTable = ({ count }: Props) => {
  const { t } = useTranslation();

  const [openField, setOpenField] = useState(false);
  const [openSections, setOpenSections] = useState(false);

  const { permissions } = useAuthData();

  return (
    <>
      <ListTableHeader title={`${t('customForms.userCustomFields')}: ${count}`}>
        {permissions.includes('customFields:create') && (
          <div className="link">
            <Menu className="big-btn" isCloseOnMenu>
              <MenuItem onClick={() => void setOpenField(true)}>
                <MenuItemContent className="btn"><FieldIcon size={20} />{t('customForms.newField')}</MenuItemContent>
              </MenuItem>
              <MenuItem onClick={() => void setOpenSections(true)}>
                <MenuItemContent className="btn"><FormIcon size={20} />{t('customForms.sections')}</MenuItemContent>
              </MenuItem>
            </Menu>
            <IconButton className="small-btn primary" onClick={() => void setOpenField(true)}><FieldIcon size={25} /></IconButton>
            <IconButton className="small-btn primary" onClick={() => void setOpenSections(true)}><FormIcon size={25} /></IconButton>
          </div>
        )}
      </ListTableHeader>
      {!!openField && (
        <BindingDialog
          defaultData
          title={t('customForms.newField')}
          open={!!openField}
          onClose={() => { setOpenField(false); }}
        />
      )}
      {!!openSections && (
        <SectionsDialog open={!!openSections} onClose={() => void setOpenSections(false)}/>
      )}
    </>
  );
};

export default memo(HeaderTable);
