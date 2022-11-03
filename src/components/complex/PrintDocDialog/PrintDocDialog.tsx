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

export type UserData = {
  _id: string,
  name: string,
  surname: string,
}

type Props = DialogProps & {
  users: UserData[];
}

const PrintDocDialog = ({ users, onClose, ...rest }: Props) => {
  const { t } = useTranslation();
  const { data: docsTemplates = [] } = useGetDocsTemplates();
  const downloadDoc = useDownloadPrintedTemplate();
  const [selectedTemplates, setSelectedTemplates] = useState<IDocsTemplate[]>([]);

  const downloadHandler = () => {
    if (!users.length || !selectedTemplates.length) return;
    onClose();
    if (users.length === 1 && selectedTemplates.length === 1) {
      downloadDoc(
        users.map((item) => item._id),
        selectedTemplates.map((item) => item._id as string),
        `${selectedTemplates[0].name}_${users[0].name}_${users[0].surname}.docx`,
      );
    } else {
      downloadDoc(
        users.map((item) => item._id),
        selectedTemplates.map((item) => item._id as string),
      );
    }
  };

  return (
    <Dialog onClose={onClose} title={t('docsTemplates.print')} {...rest}>
      <DialogContentWrapper>
        <Autocomplete
          options={docsTemplates}
          label={t('navbar.docsTemplates')}
          labelKey="name"
          onChange={setSelectedTemplates}
          multiple
          className="templates-select"
          disableCloseOnSelect={false}
        />
        <Button onClick={downloadHandler} disabled={!selectedTemplates.length}><DownloadFileIcon size={20} />{t('download')}</Button>
      </DialogContentWrapper>
    </Dialog>
  );
};

export default PrintDocDialog;
