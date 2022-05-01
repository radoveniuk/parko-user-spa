import Accordion from 'components/shared/Accordion';
import Button from 'components/shared/Button';
import Input from 'components/shared/Input';
import { IUser } from 'interfaces/users.interface';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PROFILE_BASE_FIELDS, PROFILE_DOCS_FIELDS, UserField } from './fields';
import { ProfileInfoFormWrapper } from './styles';

type FormFields = Partial<IUser> & {
  passScancopy: File;
}

const ProfileInfoForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormFields>();
  const { t } = useTranslation();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    console.log(data);
  };

  const generateField = (fieldName: keyof IUser, fieldData: UserField | undefined) => (
    <>
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
        <Input
          label={t(`user.${fieldName}`)}
          error={!!errors[fieldName]}
          {...register(fieldName, {
            required: fieldData.required,
          })}
        />
      )}
      {fieldData?.type === 'date' && (
        <Input
          label={t(`user.${fieldName}`)}
          error={!!errors[fieldName]}
          {...register(fieldName, {
            required: fieldData.required,
          })}
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
    </>
  );

  return (
    <ProfileInfoFormWrapper>
      <Accordion title={t('user.baseFields')} id="baseFields" className="accordion" expanded>
        <div className="accordion-content">
          {(Object.keys(PROFILE_BASE_FIELDS) as (keyof typeof PROFILE_BASE_FIELDS)[]).map((key) => (
            <div key={key} className="field-wrap">
              {generateField(key, PROFILE_BASE_FIELDS[key])}
            </div>
          ))}
        </div>
      </Accordion>
      <Accordion title={t('user.docsInfo')} id="docsInfo" className="accordion">
        <div className="accordion-content">
          {(Object.keys(PROFILE_DOCS_FIELDS) as (keyof typeof PROFILE_DOCS_FIELDS)[]).map((key) => (
            <div key={key} className="field-wrap">
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
