import React from 'react';
import _ from 'lodash-es';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Accordion from 'components/shared/Accordion';
import Button from 'components/shared/Button';
import Input from 'components/shared/Input';
import { IUser } from 'interfaces/users.interface';

import { PROFILE_BASE_FIELDS, PROFILE_DOCS_FIELDS, UserField, UserFormFields } from './fields';

import { ProfileInfoFormWrapper } from './styles';
import Checkbox from 'components/shared/Checkbox';
import DatePicker from 'components/shared/DatePicker';

const ProfileInfoForm = () => {
  const { register, handleSubmit, formState: { errors }, watch, control } = useForm<UserFormFields>();
  const { t } = useTranslation();

  const onSubmit: SubmitHandler<UserFormFields> = (data) => {
    console.log(data);
  };

  const generateField = (fieldName: keyof IUser, fieldData: UserField | undefined) =>
    (_.isUndefined(fieldData?.visible) || fieldData?.visible?.(watch)) && (
      <div className="field-wrap">
        {fieldData?.type === 'string' && (
          <Input
            label={t(`user.${fieldName}`)}
            error={!!errors[fieldName]}
            {...register(fieldName, {
              required: fieldData.required,
            })}
          />
        )}
        {fieldData?.type === 'boolean' && (
          <Checkbox
            title={t(`user.${fieldName}`)}
            {...register(fieldName)}
          />
        )}
        {fieldData?.type === 'date' && (
          <Controller
            control={control}
            name={fieldName}
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                label={t(`user.${fieldName}`)}
              />
            )}
          />
        )}
        {fieldData?.type === 'select' && (
          <Input
            label={t(`user.${fieldName}`)}
            error={!!errors[fieldName]}
            {...register(fieldName, {
              required: fieldData.required,
            })}
          />
        )}
      </div>
    );

  return (
    <ProfileInfoFormWrapper>
      <Accordion title={t('user.baseFields')} id="baseFields" className="accordion" defaultExpanded>
        <div className="accordion-content">
          {(Object.keys(PROFILE_BASE_FIELDS) as (keyof typeof PROFILE_BASE_FIELDS)[]).map((key) => (
            <div key={key}>
              {generateField(key, PROFILE_BASE_FIELDS[key])}
            </div>
          ))}
        </div>
      </Accordion>
      <Accordion title={t('user.docsInfo')} id="docsInfo" className="accordion">
        <div className="accordion-content">
          {(Object.keys(PROFILE_DOCS_FIELDS) as (keyof typeof PROFILE_DOCS_FIELDS)[]).map((key) => (
            <div key={key}>
              {generateField(key, PROFILE_DOCS_FIELDS[key])}
            </div>
          ))}
        </div>
      </Accordion>
      <Button onClick={handleSubmit(onSubmit)}>Update info</Button>
    </ProfileInfoFormWrapper>
  );
};

export default ProfileInfoForm;
