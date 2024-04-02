import React, { memo, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import isEmpty from 'lodash-es/isEmpty';
import Button from 'v2/uikit/Button';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';
import IconButton from 'v2/uikit/IconButton';
import Input from 'v2/uikit/Input';
import Select from 'v2/uikit/Select';

import { useGetCustomFormFields } from 'api/query/customFormsQuery';
import { DeleteIcon, DragIcon, PlusIcon } from 'components/icons';
import BooleanSelect from 'components/shared/BooleanSelect';
import createId from 'helpers/createId';
import reorder from 'helpers/reorder';
import { ICustomForm } from 'interfaces/form.interface';

import useCustomFormActions from '../hooks/useCustomFormActions';

import { DialogContentWrapper } from './styles';

type CustomFieldSetting = {
  id: string;
  field: string;
  isRequired: boolean;
};

type Props = DialogProps & {
  defaultData: ICustomForm | true;
};

const FormDialog = ({ defaultData, onClose, ...rest }: Props) => {
  const { t } = useTranslation();
  const {
    register, formState: { errors }, handleSubmit,
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

  const submitHandler: SubmitHandler<ICustomForm> = (formValues) => {
    if (fieldSettings.some(item => !item.field)) {
      setTriggerredSettings(true);
      return;
    }
    const values: ICustomForm = {
      ...formValues,
      fields: fieldSettings.map(item => item.field),
      requiredFields: fieldSettings.filter(item => item.isRequired).map(item => item.field),
    };
    defaultData === true ? create(values) : update(values);
    onClose();
  };

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
                              labelPath="names.sk"
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
                            <IconButton onClick={() => void removeFieldSetting(setting.id)}><DeleteIcon size={16} /></IconButton>
                            <IconButton {...provided.dragHandleProps}><DragIcon size={16} /></IconButton>
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
