import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Menu, MenuItem } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';
import ListTableHeader from 'v2/uikit/ListTableHeader';

import { CodeIcon, FileGroupIcon, FileIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';

import { CategoriesDialog, FieldsDialog, TemplateDialog } from '../dialogs';

import { MenuItemContent } from './styles';

type Props = {
  count: number;
}

const HeaderTable = ({ count }: Props) => {
  const { t } = useTranslation();

  const [openTemplate, setOpenTemplate] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);
  const [openFieldCodes, setOpenFieldCodes] = useState(false);

  const { permissions } = useAuthData();

  return (
    <>
      <ListTableHeader title={`${t('navbar.docsTemplates')}: ${count}`}>
        <div className="link">
          <Button className="big-btn" onClick={() => void setOpenFieldCodes(true)}><CodeIcon size={20}/>{t('docsTemplates.codes')}</Button>
          {permissions.includes('docsTemplates:create') && (
            <>
              <Menu className="big-btn" isCloseOnMenu>
                <MenuItem onClick={() => void setOpenTemplate(true)}>
                  <MenuItemContent className="btn"><FileIcon size={20} />{t('docsTemplates.new')}</MenuItemContent>
                </MenuItem>
                <MenuItem onClick={() => void setOpenCategories(true)}>
                  <MenuItemContent className="btn"><FileGroupIcon size={20} />{t('docsTemplates.categories')}</MenuItemContent>
                </MenuItem>
              </Menu>
              <IconButton className="small-btn primary" onClick={() => void setOpenTemplate(true)}><FileIcon size={25} /></IconButton>
              <IconButton className="small-btn primary" onClick={() => void setOpenFieldCodes(true)}><CodeIcon size={25} /></IconButton>
            </>
          )}
        </div>
      </ListTableHeader>
      {!!openTemplate && (
        <TemplateDialog
          defaultData
          title={t('docsTemplates.template')}
          open={!!openTemplate}
          onClose={() => { setOpenTemplate(false); }}
        />
      )}
      {!!openFieldCodes && (
        <FieldsDialog title={t('docsTemplates.codes')} open={!!openFieldCodes} onClose={() => void setOpenFieldCodes(false)}/>
      )}
      {!!openCategories && (
        <CategoriesDialog open={!!openCategories} onClose={() => void setOpenCategories(false)}/>
      )}
    </>
  );
};

export default memo(HeaderTable);
