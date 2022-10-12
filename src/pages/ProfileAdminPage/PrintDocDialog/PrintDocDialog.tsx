import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useDownloadPrintedTemplate } from 'api/mutations/docsTemplateMutation';
import { useGetDocsTemplates } from 'api/query/docsTemplateQuery';
import Autocomplete from 'components/shared/Autocomplete';
import Button from 'components/shared/Button';
import Dialog, { DialogProps } from 'components/shared/Dialog';
import { IDocsTemplate } from 'interfaces/docsTemplate.interface';

import { DialogContentWrapper } from './styles';

const PrintDocDialog = ({ ...rest }: DialogProps) => {
  const { t } = useTranslation();
  const { data: docsTemplates = [] } = useGetDocsTemplates();
  const { id: userId } = useParams();
  const downloadDoc = useDownloadPrintedTemplate();
  const [selectedTemplate, setSelectedTemplate] = useState<IDocsTemplate | null>(null);

  const downloadHandler = () => {
    if (!userId || !selectedTemplate?._id) return;
    downloadDoc([userId], selectedTemplate._id);
  };

  return (
    <Dialog title={t('docsTemplates.print')} {...rest}>
      <DialogContentWrapper>
        <Autocomplete
          options={docsTemplates}
          label={t('navbar.docsTemplates')}
          labelKey="name"
          onChange={setSelectedTemplate}
        />
        <Button onClick={downloadHandler} disabled={!selectedTemplate}>{t('approve')}</Button>
      </DialogContentWrapper>
    </Dialog>
  );
};

export default PrintDocDialog;
