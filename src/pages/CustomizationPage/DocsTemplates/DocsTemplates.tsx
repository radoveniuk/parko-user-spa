import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useDeleteDocsTemplate } from 'api/mutations/docsTemplateMutation';
import { useDeleteFileMutation } from 'api/mutations/fileMutation';
import { useGetDocsTemplates } from 'api/query/docsTemplateQuery';
import downloadFile from 'api/query/downloadFile';
import { CloseIcon, DownloadFileIcon, EditIcon, EyeIcon, PlusIcon } from 'components/icons';
import Button from 'components/shared/Button';
import DialogConfirm from 'components/shared/DialogConfirm';
import IconButton from 'components/shared/IconButton';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { PageActions } from 'components/shared/PageComponents';
import { IDocsTemplate } from 'interfaces/docsTemplate.interface';
import { IFile } from 'interfaces/file.interface';

import { FieldsDialog, TemplateDialog } from './dialogs';
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
  const { data: docsTemplates = [], refetch } = useGetDocsTemplates();
  const deleteTemplateMutation = useDeleteDocsTemplate();
  const deleteFileMutation = useDeleteFileMutation();

  const [openTemplate, setOpenTemplate] = useState<IDocsTemplate | boolean>(false);
  const [openFieldCodes, setOpenFieldCodes] = useState(false);
  const [deleteTemplate, setDeleteTemplate] = useState<IDocsTemplate | null>(null);

  return (
    <DocsTemplatesWrapper>
      <PageActions>
        <Button onClick={() => void setOpenTemplate(true)}><PlusIcon size={20} />{t('add')}</Button>
        <Button variant="outlined" color="secondary" onClick={() => void setOpenFieldCodes(true)}><EyeIcon />{t('docsTemplates.codes')}</Button>
      </PageActions>
      <ListTable columns={COLS} maxHeight="calc(100vh - 175px)">
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
            <ListTableCell onClick={() => void setOpenTemplate(templateItem)}><IconButton><EditIcon /></IconButton></ListTableCell>
            <ListTableCell onClick={() => void setDeleteTemplate(templateItem)}><IconButton><CloseIcon /></IconButton></ListTableCell>
          </ListTableRow>
        ))}
      </ListTable>
      {!!openTemplate && (
        <TemplateDialog
          defaultData={openTemplate}
          title={t('docsTemplates.template')}
          open={!!openTemplate}
          onClose={() => { setOpenTemplate(false); refetch(); }}
        />
      )}
      {!!openFieldCodes && (
        <FieldsDialog title={t('docsTemplates.codes')} open={!!openFieldCodes} onClose={() => void setOpenFieldCodes(false)}/>
      )}
      {!!deleteTemplate && (
        <DialogConfirm
          open={!!deleteTemplate}
          onClose={() => void setDeleteTemplate(null)}
          onSubmit={() => {
            if (!deleteTemplate?._id) return;
            Promise.all([
              deleteTemplateMutation.mutateAsync(deleteTemplate._id),
              deleteFileMutation.mutateAsync(deleteTemplate.file as IFile),
            ]).then(() => {
              setDeleteTemplate(null);
              refetch();
            });
          }}
        />
      )}
    </DocsTemplatesWrapper>
  );
};

export default DocsTemplates;
