import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useGetUserList } from 'api/query/userQuery';
import Accordion, { AccordionContent } from 'components/shared/Accordion';
import BooleanSelect from 'components/shared/BooleanSelect';
import DatePicker from 'components/shared/DatePicker';
import Input from 'components/shared/Input';
import PhoneInput, { checkPhoneNumber } from 'components/shared/PhoneInput';
import Select from 'components/shared/Select';
import { COUNTRIES } from 'constants/countries';
import { EMPLOYMENT_TYPE, FAMILY_STATUSES, PERMIT_TYPES, SIZES, STUDY } from 'constants/selectsOptions';
import { useAuthData } from 'contexts/AuthContext';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IUser2 } from 'interfaces/users.interface';

import { SECTIONS, UserField } from './fields';
import { ProfileFormWrapper } from './styles';

type Props = {
  defaultValues?: IUser2;
}

const ProfileForm = ({ defaultValues }: Props) => {
  const { t } = useTranslation();
  const { role } = useAuthData();
  const { register, formState: { errors }, control } = useForm<IUser2>();

  const { data: recruiters = [] } = useGetUserList({ role: 'admin' });

  const familyStateOptions = useTranslatedSelect(FAMILY_STATUSES, 'familyStatus');
  const studyOptions = useTranslatedSelect(STUDY, 'study');
  const permitTypeOptions = useTranslatedSelect(PERMIT_TYPES, 'permitType');
  const employmentTypeOptions = useTranslatedSelect(EMPLOYMENT_TYPE, 'employmentType');

  const selectOptions: any = {
    pantsSize: SIZES,
    tshortSize: SIZES,
    permitType: permitTypeOptions,
    country: COUNTRIES.sort(),
    familyState: familyStateOptions,
    study: studyOptions,
    recruiter: recruiters.map((item) => `${item.name} ${item.surname}`),
    source: recruiters.map((item) => `${item.name} ${item.surname}`),
    sex: ['male', 'female'],
    employmentType: employmentTypeOptions,
  };

  const generateField = (fieldName: keyof IUser2, fieldData: UserField | undefined) => (
    <div className="field-wrap">
      {(fieldData?.type === 'string' || fieldData?.type === 'number') && (
        <Input
          type={fieldData.type}
          label={t(`user.${fieldName}`)}
          defaultValue={defaultValues?.[fieldName] || ''}
          error={!!errors[fieldName]}
          helperText={errors?.[fieldName] && (errors?.[fieldName] as any).message}
          {...register(fieldName, {
            required: fieldData.required,
            validate: fieldData.validation,
          })}
        />
      )}
      {fieldData?.type === 'phone' && (
        <Controller
          control={control}
          name={fieldName}
          defaultValue={defaultValues?.[fieldName] || ''}
          rules={{ validate: (value) => !value || checkPhoneNumber(value as string), required: fieldData.required }}
          render={({ field }) => (
            <PhoneInput
              value={field.value as string}
              onChange={field.onChange}
              label={t('project.phone')}
              error={!!errors.phone}
            />
          )}
        />
      )}
      {fieldData?.type === 'boolean' && (
        <Controller
          control={control}
          name={fieldName}
          defaultValue={typeof defaultValues?.[fieldName] === 'boolean' ? defaultValues?.[fieldName] : undefined}
          render={({ field }) => (
            <BooleanSelect
              defaultValue={field.value as boolean}
              onChange={field.onChange}
              label={t(`user.${fieldName}`)}
            />
          )}
        />
      )}
      {fieldData?.type === 'date' && (
        <Controller
          control={control}
          name={fieldName}
          defaultValue={defaultValues?.[fieldName] || ''}
          render={({ field }) => (
            <DatePicker
              value={field.value as string}
              onChange={field.onChange}
              label={t(`user.${fieldName}`)}
            />
          )}
        />
      )}
      {(fieldData?.type === 'select' && selectOptions[fieldName]) && (
        <Select
          options={selectOptions[fieldName] || []}
          defaultValue={defaultValues?.[fieldName] || ''}
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

  return (
    <ProfileFormWrapper>
      {Object.keys(SECTIONS).map((sectionKey: string) => (
        <Accordion
          key={sectionKey}
          title={t(`user.${sectionKey}`)}
          id={sectionKey}
          className="accordion"
          defaultExpanded
        >
          <AccordionContent>
            {(Object.keys(SECTIONS[sectionKey]) as (keyof IUser2)[]).map((fieldKey) => {
              const fieldData = SECTIONS[sectionKey][fieldKey];
              if (fieldData?.permissionRoles === undefined || fieldData.permissionRoles.includes(role as string)) {
                return (
                  <React.Fragment key={fieldKey}>
                    {generateField(fieldKey, fieldData)}
                  </React.Fragment>
                );
              }
              return null;
            })}
          </AccordionContent>
        </Accordion>
      ))}
    </ProfileFormWrapper>
  );
};

export default ProfileForm;
