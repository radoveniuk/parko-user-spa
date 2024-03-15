import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { IconButton } from '@mui/material';
import isEmpty from 'lodash-es/isEmpty';
import AutoComplete from 'v2/uikit/Autocomplete/Autocomplete';
import Button from 'v2/uikit/Button';
import Dialog, { DialogProps } from 'v2/uikit/Dialog';
import FileInput from 'v2/uikit/FileInput';
import Input from 'v2/uikit/Input';

import { uploadFiles } from 'api/common';
import { useCreateDocsTemplate, useUpdateDocsTemplate } from 'api/mutations/docsTemplateMutation';
import { useGetDocsTemplateCategories } from 'api/query/docsTemplateCategoryQuery';
import downloadFile from 'api/query/downloadFile';
import { DeleteIcon, FileIcon, UploadIcon } from 'components/icons';
import { IDocsTemplate } from 'interfaces/docsTemplate.interface';
import { IFile } from 'interfaces/file.interface';
import { themeConfig } from 'theme';

import { DialogContentWrapper, FileInputArea } from './styles';

type Props = DialogProps & {
  defaultData: IDocsTemplate | true;
};

export const TemplateDialog = ({ defaultData, onClose, ...rest }: Props) => {
  const { t } = useTranslation();
  const {
    register, control, formState: { errors }, handleSubmit,
  } = useForm<IDocsTemplate>({ defaultValues: typeof defaultData !== 'boolean' ? defaultData : {} });
  const createTemplate = useCreateDocsTemplate();
  const updateTemplate = useUpdateDocsTemplate();
  const queryClient = useQueryClient();
  const queryKey = ['docsTemplates', JSON.stringify({})];

  const { data: categories = [] } = useGetDocsTemplateCategories();

  const submitHandler: SubmitHandler<IDocsTemplate> = async (values) => {
    const updateFn = (uploadedFileData: IFile) => {
      const mutation = defaultData === true ? createTemplate : updateTemplate;

      mutation.mutateAsync({
        name: values.name,
        file: uploadedFileData?._id,
        category: (typeof values.category === 'string' || values.category === null) ? values.category : values.category?._id,
        ...(defaultData !== true && { _id: defaultData._id }),
      }).then((res) => {
        const prevData = queryClient.getQueryData(queryKey) as IDocsTemplate[];
        const valuesToUpdate = {
          ...res,
          name: values.name,
          file: uploadedFileData,
          category: values.category,
        };
        queryClient.setQueryData(
          queryKey,
          defaultData === true ? [valuesToUpdate, ...prevData] : prevData.map(item => item._id === res._id ? valuesToUpdate : item),
        );
        onClose();
      });
    };

    const isFile = (input: File | IFile | string) => 'File' in window && input instanceof File;

    if (isFile(values.file)) {
      const formData = new window.FormData();
      formData.append('files', values.file as File);
      const [uploadedFileData] = await uploadFiles(formData);
      updateFn(uploadedFileData);
    } else if (defaultData !== true) {
      updateFn((defaultData.file as IFile));
    }
  };

  return (
    <Dialog
      onClose={onClose}
      mobileFullscreen
      {...rest}
    >
      <DialogContentWrapper>
        <div className="form">
          <Input
            theme="gray"
            label={t('file.name')}
            error={!!errors.name}
            {...register('name', { required: true })}
          />
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <AutoComplete
                theme="gray"
                label={t('docsTemplates.category')}
                options={categories}
                valueKey="_id"
                labelKey="name"
                onChange={field.onChange}
                value={field.value}
              />
            )}
          />
          <Controller
            control={control}
            rules={{ required: true }}
            name="file"
            render={({ field, fieldState }) => (
              <FileInputArea className={fieldState.error ? 'error' : ''}>
                {!field.value && (
                  <FileInput
                    accept=".docx"
                    multiple={false}
                    className="FileInput"
                    onChange={async (e) => {
                      if (e.target.files?.length) {
                        field.onChange(e.target.files[0]);
                      }
                    }}
                  >
                    {t('user.upload')}
                    <UploadIcon />
                  </FileInput>
                )}
                {(!!field.value && (field.value as File).lastModified) && (
                  <div className="file-link" title={(field.value as File).name}>
                    <div
                      role="button"
                      className="content"
                    >
                      <div className="name">
                        {(field.value as File).name}
                      </div>
                    </div>
                    <IconButton
                      className="delete-icon"
                      onClick={() => void field.onChange(null)}
                    >
                      <DeleteIcon color={themeConfig.palette.error.main} size={18} />
                    </IconButton>
                  </div>
                )}
                {(!!field.value && (field.value as IFile)._id) && (
                  <div className="file-link" title={`${(field.value as IFile).originalname}.${(field.value as IFile).ext}`}>
                    <div
                      role="button"
                      onClick={() => {
                        const file = field.value as IFile;
                        downloadFile(file._id, file.originalname, file.ext || 'docx', 'save');
                      }}
                      className="content"
                    >
                      <div className="name">
                        {(field.value as IFile).originalname}.{(field.value as IFile).ext}
                      </div>
                      <FileIcon size={24} />
                    </div>
                    <IconButton
                      className="delete-icon"
                      onClick={() => void field.onChange(null)}
                    >
                      <DeleteIcon color={themeConfig.palette.error.main} size={18} />
                    </IconButton>
                  </div>
                )}
              </FileInputArea>
            )}
          />
        </div>
        <div className="actions">
          <Button
            onClick={handleSubmit(submitHandler)}
            disabled={!isEmpty(errors)}
            variant="contained"
          >
            {t('approve')}
          </Button>
        </div>
      </DialogContentWrapper>
    </Dialog>
  );
};
