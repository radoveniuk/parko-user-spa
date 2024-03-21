import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import isEmpty from 'lodash-es/isEmpty';
import Button from 'v2/uikit/Button';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';
import Select from 'v2/uikit/Select';

import { useGetCustomFormFields, useGetCustomFormSections } from 'api/query/customFormsQuery';
import BooleanSelect from 'components/shared/BooleanSelect';
import { ICustomFormFieldSectionBinding } from 'interfaces/form.interface';

import useBindingActions from '../hooks/useBindingActions';

import { DialogContentWrapper } from './styles';

type Props = DialogProps & {
  defaultData: ICustomFormFieldSectionBinding<true> | true;
};

export const BindingDialog = ({ defaultData, onClose, ...rest }: Props) => {
  const { t, i18n } = useTranslation();
  const {
    formState: { errors }, handleSubmit, control,
  } = useForm<ICustomFormFieldSectionBinding>({
    defaultValues: typeof defaultData !== 'boolean' ? { ...defaultData, field: defaultData.field._id, section: defaultData.section._id } : {},
  });

  const { data: fields = [] } = useGetCustomFormFields();
  const { data: sections = [] } = useGetCustomFormSections({ entity: 'user' });

  const { create, update } = useBindingActions();

  const submitHandler: SubmitHandler<ICustomFormFieldSectionBinding> = async (values) => {
    defaultData === true ? create(values) : update(values);
    onClose();
  };

  return (
    <Dialog
      onClose={onClose}
      mobileFullscreen
      {...rest}
    >
      <DialogContentWrapper>
        <div className="form">
          <Controller
            control={control}
            name="field"
            defaultValue={defaultData !== true ? defaultData.field._id : ''}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <Select
                label={t('customForms.field')}
                options={fields}
                valuePath="_id"
                labelPath={(item) => item.names[i18n.language]}
                theme="gray"
                value={field.value}
                onChange={field.onChange}
                error={!!fieldState.error}
              />
            )}
          />
          <Controller
            control={control}
            name="section"
            defaultValue={defaultData !== true ? defaultData.section._id : ''}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <Select
                label={t('customForms.section')}
                options={sections}
                valuePath="_id"
                labelPath={(item) => item.names[i18n.language]}
                theme="gray"
                value={field.value}
                onChange={field.onChange}
                error={!!fieldState.error}
              />
            )}
          />
          <Controller
            control={control}
            name="isRequired"
            defaultValue={defaultData !== true ? defaultData.isRequired : false}
            render={({ field }) => (
              <BooleanSelect
                label={t('customForms.isRequired')}
                isEmptyItem={false}
                defaultValue={field.value as boolean}
                onChange={field.onChange}
                theme="gray"
              />
            )}
          />
        </div>
        <DialogActions>
          <Button
            onClick={handleSubmit(submitHandler)}
            disabled={!isEmpty(errors)}
            variant="contained"
          >
            {t('approve')}
          </Button>
        </DialogActions>
      </DialogContentWrapper>
    </Dialog>
  );
};
