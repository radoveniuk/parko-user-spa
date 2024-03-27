import React, { memo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import CustomField from 'components/complex/CustomField';
import { ICustomForm, ICustomFormField } from 'interfaces/form.interface';

import { CustomFormWrapper } from './styles';

type Props = {
  form: ICustomForm;
  disabled?: boolean;
};

const CustomForm = ({ form, disabled }: Props) => {
  const { i18n } = useTranslation();
  const { control } = useFormContext();

  return (
    <CustomFormWrapper>
      {(form.fields as ICustomFormField[]).map((customField) => (
        <Controller
          key={customField._id}
          name={customField._id}
          control={control}
          rules={{ required: form.requiredFields.includes(customField._id) }}
          render={({ field, fieldState }) => (
            <CustomField
              value={field.value}
              onChange={field.onChange}
              metadata={customField}
              disabled={disabled}
              label={customField.names[i18n.language]}
              theme="gray"
              error={!!fieldState.error}
            />
          )}
        />
      ))}
    </CustomFormWrapper>
  );
};

export default memo(CustomForm);
