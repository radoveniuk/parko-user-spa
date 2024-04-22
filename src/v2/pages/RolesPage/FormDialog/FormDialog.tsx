import React, { memo, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import isEmpty from 'lodash-es/isEmpty';
import useCopyToClipboard from 'v2/hooks/useCopyToClipboard';
import Button from 'v2/uikit/Button';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';
import FileInput from 'v2/uikit/FileInput';
import FormLabel from 'v2/uikit/FormLabel';
import IconButton from 'v2/uikit/IconButton';
import Input from 'v2/uikit/Input';
import Select from 'v2/uikit/Select';

import { uploadFiles } from 'api/common';
import { useGetCustomFormFields } from 'api/query/customFormsQuery';
import downloadFile from 'api/query/downloadFile';
import { CodeIcon, DeleteIcon, DragIcon, FileIcon, PlusIcon, UploadIcon } from 'components/icons';
import BooleanSelect from 'components/shared/BooleanSelect';
import createId from 'helpers/createId';
import reorder from 'helpers/reorder';
import { IFile } from 'interfaces/file.interface';
import { ICustomForm } from 'interfaces/form.interface';
import { themeConfig } from 'theme';

import useCustomFormActions from '../hooks/useCustomFormActions';

import { DialogContentWrapper, FileInputArea } from './styles';

type CustomFieldSetting = {
  id: string;
  field: string;
  isRequired: boolean;
};

type Props = DialogProps & {
  defaultData: ICustomForm | true;
};

const FormDialog = ({ defaultData, onClose, ...rest }: Props) => {
  const { t, i18n } = useTranslation();
  const {
    register, formState: { errors }, handleSubmit, control,
  } = useForm<ICustomForm>({ defaultValues: typeof defaultData !== 'boolean' ? defaultData : {} });

  // fields settings

  const { data: customFormFields } = useGetCustomFormFields();
  const [fieldSettings, setFieldSettings] = useState((typeof defaultData === 'boolean'
    ? []
    : defaultData.fields
      .map((field) => ({ field, isRequired: defaultData.requiredFields.includes(field as string), id: createId() }))) as CustomFieldSetting[]);

  const removeFieldSetting = (id: string) => {
    setFieldSettings((prev) => prev.filter((item) => item.id !== id));
  };

  // field settings dragndrop

  const onDragEnd = (result: DropResult) => {
    const dest = result.destination;
    if (dest) {
      setFieldSettings(prev => reorder(
        prev,
        result.source.index,
        dest.index,
      ));
    }
  };

  // field settings validation
  const [triggerredSettings, setTriggerredSettings] = useState(false);

  // form submit
  const { create, update } = useCustomFormActions();

  const submitHandler: SubmitHandler<ICustomForm> = async (formValues) => {
    if (fieldSettings.some(item => !item.field)) {
      setTriggerredSettings(true);
      return;
    }

    const file = formValues.summaryTemplate;

    const isFile = !!(file as unknown as File)?.lastModified;
    let summaryTemplateId = (file as IFile)?._id || '';
    if (isFile) {
      const formData = new window.FormData();

      formData.append('files', file as unknown as File);

      const [uploadedFileData] = await uploadFiles(formData);
      summaryTemplateId = uploadedFileData._id;
    }

    const values: ICustomForm = {
      ...formValues,
      fields: fieldSettings.map(item => item.field),
      requiredFields: fieldSettings.filter(item => item.isRequired).map(item => item.field),
      summaryTemplate: summaryTemplateId || null,
    };
    defaultData === true ? create(values) : update(values);
    onClose();
  };

  const copy = useCopyToClipboard();

  return (
    <Dialog
      onClose={onClose}
      fullScreen
      {...rest}
    >
      <DialogContentWrapper>
        <div className="form">
          <Input
            label={t('customForms.formName')}
            theme="gray"
            error={!!errors.name}
            {...register('name', { required: true })}
          />
          <Controller
            control={control}
            name="summaryTemplate"
            render={({ field }) => (
              <div>
                <FormLabel>
                  {t('docsTemplates.template')}
                </FormLabel>
                <FileInputArea>
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
                  {(!!field.value && (field.value as unknown as File).lastModified) && (
                    <div className="file-link" title={(field.value as unknown as File).name}>
                      <div
                        role="button"
                        className="content"
                      >
                        <div className="name">
                          {(field.value as unknown as File).name}
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
              </div>
            )}
          />
        </div>
        <div className="fields">
          <div className="label separated">{t('customForms.fields')}</div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="vertical">
              {(provided) => (
                <div className="grid"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <div className="row">
                    <div className="cell label">{t('customForms.field')}</div>
                    <div className="cell label">{t('customForms.isRequired')}</div>
                  </div>
                  {fieldSettings.map((setting, index) => (
                    <Draggable key={setting.id} draggableId={setting.id} index={index}>
                      {(provided) => (
                        <div className="row" ref={provided.innerRef} {...provided.draggableProps}>
                          <div className="cell">
                            <Select
                              label={t('customForms.field')}
                              options={customFormFields}
                              valuePath="_id"
                              labelPath={`names.${i18n.language}`}
                              defaultValue={setting.field}
                              theme="gray"
                              className="border-right"
                              onChange={(e) => {
                                setFieldSettings(prev => prev.map((prevSetting) => prevSetting.id === setting.id
                                  ? ({ ...prevSetting, field: e.target.value as string })
                                  : prevSetting),
                                );
                                setTriggerredSettings(false);
                              }}
                              error={triggerredSettings && !setting.field}
                            />
                          </div>
                          <div className="cell">
                            <BooleanSelect
                              label={t('customForms.isRequired')}
                              isEmptyItem={false}
                              defaultValue={setting.isRequired || false}
                              theme="gray"
                              onChange={(v) => {
                                setFieldSettings(prev => prev.map((prevSetting) => prevSetting.id === setting.id
                                  ? ({ ...prevSetting, isRequired: !!v })
                                  : prevSetting),
                                );
                              }}
                            />
                          </div>
                          <div className="actions cell">
                            <IconButton onClick={() => void copy(`{${setting.field}}`)}><CodeIcon size={16} /></IconButton>
                            <IconButton onClick={() => void removeFieldSetting(setting.id)}><DeleteIcon size={16} /></IconButton>
                            <div className="drag-btn" role="button" {...provided.dragHandleProps}><DragIcon size={16} /></div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <Button
            onClick={() => void setFieldSettings(prev => [...prev, { field: '', isRequired: false, id: createId() }])}
            variant="text"
          >
            <PlusIcon size={16} /> {t('add')}
          </Button>
        </div>
      </DialogContentWrapper>
      <DialogActions>
        <Button
          onClick={handleSubmit(submitHandler)}
          disabled={!isEmpty(errors)}
          variant="contained"
        >
          {t('approve')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(FormDialog);
