import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { EyeIcon, PlusIcon } from 'components/icons';
import Button from 'components/shared/Button';
import Dialog from 'components/shared/Dialog';
import ListTable from 'components/shared/ListTable';
import { PageActions } from 'components/shared/Page';

import { DocsTemplatesWrapper } from './styles';

const COLS = [
  'docsTemplates.template',
  'file.name',
  '',
  '',
];

const DocsTemplates = () => {
  const { t } = useTranslation();

  const [openTemplate, setOpenTemplate] = useState(false);
  const [openFieldCodes, setOpenFieldCodes] = useState(false);

  return (
    <DocsTemplatesWrapper>
      <PageActions>
        <Button onClick={() => void setOpenTemplate(true)}><PlusIcon size={20} />{t('add')}</Button>
        <Button variant="outlined" color="secondary" onClick={() => void setOpenFieldCodes(true)}><EyeIcon />{t('docsTemplates.codes')}</Button>
      </PageActions>
      <ListTable columns={COLS}>

      </ListTable>
      {!!openTemplate && (
        <Dialog title={t('docsTemplates.template')} open={!!openTemplate} onClose={() => void setOpenTemplate(false)}></Dialog>
      )}
      {!!openFieldCodes && (
        <Dialog title={t('docsTemplates.codes')} open={!!openFieldCodes} onClose={() => void setOpenFieldCodes(false)}></Dialog>
      )}
    </DocsTemplatesWrapper>
  );
};

export default DocsTemplates;
