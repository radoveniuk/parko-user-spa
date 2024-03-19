import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, MenuItem, Stack } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';

import { FieldIcon, FormIcon } from 'components/icons';

import { BindingDialog } from '../dialogs';
import { SectionsDialog } from '../dialogs/SectionsDialog';

import { HeaderWrapper, MenuItemContent } from './styles';

type Props = {
  count: number;
}

const HeaderTable = ({ count }: Props) => {
  const { t } = useTranslation();

  const [openField, setOpenField] = useState(false);
  const [openSections, setOpenSections] = useState(false);

  return (
    <>
      <HeaderWrapper>
        <Stack direction="row" gap="9px" alignContent="center">
          <span className="bold">{t('customForms.userCustomFields')}: {count}</span>
        </Stack>
        <Stack direction="row" gap="15px">
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
        </Stack>
      </HeaderWrapper>
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
