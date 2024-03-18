import React, { memo, useState } from 'react';
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
    register, formState: { errors }, handleSubmit, getValues, setValue, watch, control,
  } = useForm<ICustomForm>({ defaultValues: typeof defaultData !== 'boolean' ? defaultData : {} });

  // form submit
  const { create, update } = useCustomFormActions();

  const submitHandler: SubmitHandler<ICustomForm> = (values) => {
    defaultData === true ? create(values) : update(values);
    onClose();
  };

  // fields settings

  const { data: customFormFields } = useGetCustomFormFields();
  const [fields, setFields] = useState((typeof defaultData === 'boolean'
    ? []
    : defaultData.fields
      .map((field) => ({ field, isRequired: defaultData.requiredFields.includes(field as string), id: createId() }))) as CustomFieldSetting[]);

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
          <div className="label">{t('customForms.formFields')}</div>
          <div className="grid">
            <div className="row">
              <div className="cell header">{t('customForms.field')}</div>
              <div className="cell header">{t('customForms.isRequired')}</div>
            </div>
            {fields.map((setting) => (
              <div className="row" key={setting.id}>
                <div className="cell">
                  <Select
                    options={customFormFields}
                    valuePath="_id"
                    labelPath="names.sk"
                    defaultValue={setting.field}
                    theme="gray"
                    className="border-right"
                    onChange={(e) => {
                      setFields(prev => prev.map((prevSetting) => prevSetting.id === setting.id
                        ? ({ ...prevSetting, field: e.target.value as string })
                        : prevSetting),
                      );
                    }}
                  />
                </div>
                <div className="cell">
                  <BooleanSelect
                    isEmptyItem={false}
                    defaultValue={setting.isRequired || false}
                    theme="gray"
                    onChange={(v) => {
                      setFields(prev => prev.map((prevSetting) => prevSetting.id === setting.id
                        ? ({ ...prevSetting, isRequired: !!v })
                        : prevSetting),
                      );
                    }}
                  />
                  <div className="actions">
                    <IconButton><DeleteIcon size={16} /></IconButton>
                    <IconButton><DragIcon size={16} /></IconButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button
            onClick={() => void setFields(prev => [...prev, { field: '', isRequired: false, id: createId() }])}
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
