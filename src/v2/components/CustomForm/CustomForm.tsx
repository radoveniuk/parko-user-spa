import React, { memo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import CustomField from 'components/complex/CustomField';
import { ICustomForm, ICustomFormField } from 'interfaces/form.interface';

import { CustomFormWrapper } from './styles';

type Props = {
  form: ICustomForm;
  disabled?: boolean;
};

const CustomForm = ({ form, disabled }: Props) => {
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
              theme="gray"
              error={!!fieldState.error}
              required={form.requiredFields.includes(customField._id)}
            />
          )}
        />
      ))}
    </CustomFormWrapper>
  );
};

export default memo(CustomForm);
