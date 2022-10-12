import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useDownloadPrintedTemplate } from 'api/mutations/docsTemplateMutation';
import { useGetDocsTemplates } from 'api/query/docsTemplateQuery';
import { DownloadFileIcon } from 'components/icons';
import Autocomplete from 'components/shared/Autocomplete';
import Button from 'components/shared/Button';
import Dialog, { DialogProps } from 'components/shared/Dialog';
import { IDocsTemplate } from 'interfaces/docsTemplate.interface';

import { DialogContentWrapper } from './styles';

type Props = DialogProps & {
  ids: string[];
}

const PrintDocDialog = ({ ids, onClose, ...rest }: Props) => {
  const { t } = useTranslation();
  const { data: docsTemplates = [] } = useGetDocsTemplates();
  const downloadDoc = useDownloadPrintedTemplate();
  const [selectedTemplate, setSelectedTemplate] = useState<IDocsTemplate | null>(null);

  const downloadHandler = () => {
    if (!ids.length || !selectedTemplate?._id) return;
    onClose();
    downloadDoc(ids, selectedTemplate._id);
  };

  return (
    <Dialog onClose={onClose} title={t('docsTemplates.print')} {...rest}>
      <DialogContentWrapper>
        <Autocomplete
          options={docsTemplates}
          label={t('navbar.docsTemplates')}
          labelKey="name"
          onChange={setSelectedTemplate}
        />
        <Button onClick={downloadHandler} disabled={!selectedTemplate}><DownloadFileIcon size={20} />{t('download')}</Button>
      </DialogContentWrapper>
    </Dialog>
  );
};

export default PrintDocDialog;
