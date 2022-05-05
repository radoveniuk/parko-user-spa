import React from 'react';
import _, { isEmpty } from 'lodash-es';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Accordion from 'components/shared/Accordion';
import Button from 'components/shared/Button';
import Input from 'components/shared/Input';
import { IUser } from 'interfaces/users.interface';

import { FIELDS, FieldSection, UserField } from './fields';

import { ProfileInfoFormWrapper } from './styles';
import Checkbox from 'components/shared/Checkbox';
import DatePicker from 'components/shared/DatePicker';
import { useAuthData } from 'contexts/AuthContext';
import { useGetUser } from 'api/query/userQuery';
import { useUpdateUserMutation } from 'api/mutations/userMutation';
import Select from 'components/shared/Select';
import { useSnackbar } from 'notistack';
import { useGetCountries } from 'api/query/formFieldsQuery';
import { FAMILY_STATUSES, PERMIT_TYPES, SIZES, STUDY } from 'constants/selectsOptions';
import useTranslatedSelect from 'hooks/useTranslatedSelect';

const ProfileInfoForm = () => {
  const { register, handleSubmit, formState: { errors }, watch, control } = useForm<IUser>();
  const { t } = useTranslation();
  const { id } = useAuthData();
  const { data: userData } = useGetUser(id);
  const { data: countriesOptions } = useGetCountries();
  const updateUserMutation = useUpdateUserMutation();
  const { enqueueSnackbar } = useSnackbar();
  const familyStateOptions = useTranslatedSelect(FAMILY_STATUSES);
  const studyOptions = useTranslatedSelect(STUDY);
  const permitTypeOptions = useTranslatedSelect(PERMIT_TYPES);

  const onSubmit: SubmitHandler<IUser> = (data) => {
    const updatedUserData = { ...userData, ...data };
    if (!updatedUserData.password) {
      delete updatedUserData.password;
    }

    updateUserMutation.mutateAsync(updatedUserData)
      .then(() => {
        enqueueSnackbar(t('user.dataUpdated'), { variant: 'success' });
      });
  };

  const generateField = (fieldName: keyof IUser, fieldData: UserField | undefined) => {
    const selectOptions: any = {
      pantsSize: SIZES,
      tshortSize: SIZES,
      permitType: permitTypeOptions,
      country: countriesOptions,
      familyState: familyStateOptions,
      study: studyOptions,
    };

    return !_.isUndefined(userData) && (_.isUndefined(fieldData?.visible) || fieldData?.visible?.(watch)) && (
      <div className="field-wrap">
        {(fieldData?.type === 'string' || fieldData?.type === 'number') && (
          <Input
            type={fieldData.type}
            label={t(`user.${fieldName}`)}
            defaultValue={userData[fieldName] || ''}
            error={!!errors[fieldName]}
            {...register(fieldName, {
              required: fieldData.required,
            })}
          />
        )}
        {fieldData?.type === 'boolean' && (
          <Checkbox
            defaultChecked={!!userData[fieldName] || false}
            title={t(`user.${fieldName}`)}
            {...register(fieldName)}
          />
        )}
        {fieldData?.type === 'date' && (
          <Controller
            control={control}
            name={fieldName}
            defaultValue={userData[fieldName] || ''}
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                label={t(`user.${fieldName}`)}
              />
            )}
          />
        )}
        {(fieldData?.type === 'select' && selectOptions[fieldName]) && (
          <Select
            options={selectOptions[fieldName] || []}
            defaultValue={userData[fieldName] || ''}
            label={t(`user.${fieldName}`)}
            style={{ minWidth: 200 }}
            error={!!errors[fieldName]}
            {...register(fieldName, {
              required: fieldData.required,
            })}
          />
        )}
      </div>
    );
  };

  return (
    <ProfileInfoFormWrapper>
      {(Object.keys(FIELDS) as FieldSection[]).map((fieldSectionKey, index) => (
        <Accordion
          key={fieldSectionKey}
          title={t(`user.${fieldSectionKey}`)}
          id={fieldSectionKey}
          className="accordion"
          defaultExpanded={index === 0}
        >
          <div className="accordion-content">
            {(Object.keys(FIELDS[fieldSectionKey]) as (keyof IUser)[]).map((key) => (
              <div key={key}>
                {generateField(key, FIELDS[fieldSectionKey][key])}
              </div>
            ))}
          </div>
        </Accordion>
      ))}
      <Button onClick={handleSubmit(onSubmit)} disabled={!isEmpty(errors)}>Update info</Button>
    </ProfileInfoFormWrapper>
  );
};

export default ProfileInfoForm;
