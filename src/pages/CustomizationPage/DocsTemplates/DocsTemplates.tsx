import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetDocsTemplates } from 'api/query/docsTemplateQuery';
import downloadFile from 'api/query/downloadFile';
import { CloseIcon, DownloadFileIcon, EditIcon, EyeIcon, PlusIcon } from 'components/icons';
import Button from 'components/shared/Button';
import Dialog from 'components/shared/Dialog';
import IconButton from 'components/shared/IconButton';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { PageActions } from 'components/shared/Page';

import { DocsTemplatesWrapper } from './styles';

const COLS = [
  'docsTemplates.template',
  'file.name',
  '',
  '',
  '',
];

const DocsTemplates = () => {
  const { t } = useTranslation();
  const { data: docsTemplates = [] } = useGetDocsTemplates();

  const [openTemplate, setOpenTemplate] = useState(false);
  const [openFieldCodes, setOpenFieldCodes] = useState(false);

  return (
    <DocsTemplatesWrapper>
      <PageActions>
        <Button onClick={() => void setOpenTemplate(true)}><PlusIcon size={20} />{t('add')}</Button>
        <Button variant="outlined" color="secondary" onClick={() => void setOpenFieldCodes(true)}><EyeIcon />{t('docsTemplates.codes')}</Button>
      </PageActions>
      <ListTable columns={COLS}>
        {docsTemplates.map((templateItem) => (
          <ListTableRow key={templateItem._id}>
            <ListTableCell>{templateItem.name}</ListTableCell>
            <ListTableCell>{templateItem.file.originalname}.{templateItem.file.ext}</ListTableCell>
            <ListTableCell>
              <IconButton
                onClick={() => void downloadFile(templateItem.file._id, templateItem.file.originalname, templateItem.file.ext)}
              >
                <DownloadFileIcon />
              </IconButton>
            </ListTableCell>
            <ListTableCell><IconButton><EditIcon /></IconButton></ListTableCell>
            <ListTableCell><IconButton><CloseIcon /></IconButton></ListTableCell>
          </ListTableRow>
        ))}
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
