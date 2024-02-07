import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Input from 'v2/uikit/Input';

import { uploadFiles } from 'api/common';
import { useCreateDocsTemplate, useUpdateDocsTemplate } from 'api/mutations/docsTemplateMutation';
import { FileIcon } from 'components/icons';
import Button from 'components/shared/Button';
import Dialog, { DialogProps } from 'components/shared/Dialog';
import FileInput from 'components/shared/FileInput';
import { IDocsTemplate } from 'interfaces/docsTemplate.interface';
import { IFile } from 'interfaces/file.interface';

import { DialogContentWrapper } from './styles';

type Props = DialogProps & {
  defaultData: IDocsTemplate | true;
};

export const TemplateDialog = ({ defaultData, onClose, ...rest }: Props) => {
  const { t } = useTranslation();
  const createTemplate = useCreateDocsTemplate();
  const updateTemplate = useUpdateDocsTemplate();

  const [name, setName] = useState(defaultData !== true ? defaultData.name : '');
  const [file, setFile] = useState<File | null>(null);

  const submitHandler = async () => {
    if (!name) return;

    const updateFn = (uploadedFileData: IFile) => {
      const mutation = defaultData === true ? createTemplate : updateTemplate;

      mutation.mutateAsync({
        name,
        file: uploadedFileData?._id,
        ...(defaultData !== true && { _id: defaultData._id }),
      }).then(() => {
        onClose();
      });
    };

    if (file !== null) {
      const formData = new window.FormData();
      formData.append('files', file);
      const [uploadedFileData] = await uploadFiles(formData);
      updateFn(uploadedFileData);
    } else if (defaultData !== true) {
      updateFn((defaultData.file as IFile));
    }
  };

  return (
    <Dialog
      onClose={onClose}
      {...rest}
    >
      <DialogContentWrapper>
        <div className="form">
          <Input
            label={t('file.name')}
            value={name}
            onChange={(e) => void setName(e.target.value)}
          />
          <FileInput
            onChange={(e: ChangeEvent<HTMLInputElement>) => void setFile(e.target.files?.[0] || null)}
            accept=".docx"
          >
            <FileIcon size={20} />
            {t('docsTemplates.file')}
          </FileInput>
        </div>
        <div className="actions">
          <Button
            onClick={submitHandler}
            disabled={(defaultData === true && (!name || !file)) || (defaultData !== true && !defaultData.file)}
          >
            {t('approve')}
          </Button>
        </div>
      </DialogContentWrapper>
    </Dialog>
  );
};
