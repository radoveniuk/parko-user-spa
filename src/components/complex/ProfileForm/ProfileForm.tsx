import React, { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import _ from 'lodash-es';

import { useGetCustomFormFields, useGetCustomFormSections } from 'api/query/customFormsQuery';
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
import { AnyObject } from 'interfaces/base.types';
import { IUser2 } from 'interfaces/users.interface';

import CustomField from '../CustomField';

import { SECTIONS, UserField } from './fields';
import { ProfileFormWrapper } from './styles';

type Props = {
  defaultValues?: IUser2;
}

const ProfileForm = ({ defaultValues }: Props) => {
  const { t, i18n } = useTranslation();
  const { role } = useAuthData();
  const { register, formState: { errors }, control } = useFormContext<IUser2>();

  const { data: recruiters = [] } = useGetUserList({ role: 'admin' });

  const familyStateOptions = useTranslatedSelect(FAMILY_STATUSES, 'familyStatus');
  const studyOptions = useTranslatedSelect(STUDY, 'study');
  const permitTypeOptions = useTranslatedSelect(PERMIT_TYPES, 'permitType');
  const employmentTypeOptions = useTranslatedSelect(EMPLOYMENT_TYPE, 'employmentType');
  const sexOptions = useTranslatedSelect(['male', 'female']);

  // custom fields
  const { data: customSections = [] } = useGetCustomFormSections({ entity: 'user' });
  const { data: customFields = [] } = useGetCustomFormFields({
    entity: 'user',
    projects: defaultValues?.project ? [defaultValues.project as string] : 'null',
  }, { enabled: !!defaultValues });

  const selectOptions: AnyObject = useMemo(() => ({
    pantsSize: SIZES,
    tshortSize: SIZES,
    permitType: permitTypeOptions,
    country: COUNTRIES.sort(),
    familyState: familyStateOptions,
    study: studyOptions,
    recruiter: recruiters.map((item) => `${item.name} ${item.surname}`),
    source: recruiters.map((item) => `${item.name} ${item.surname}`),
    sex: sexOptions,
    employmentType: employmentTypeOptions,
  }), [employmentTypeOptions, familyStateOptions, permitTypeOptions, recruiters, sexOptions, studyOptions]);

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
      {customSections
        .filter((section) => customFields.some((customField) => customField.section === section._id))
        .map((section) => (
          <Accordion
            key={section._id}
            title={section.names[i18n.language]}
            id={section._id}
            className="accordion"
          >
            <AccordionContent>
              {customFields
                .filter((customField) => customField.section === section._id)
                .map((customField) => (
                  <Controller
                    key={customField._id}
                    name={`customFields.${customField._id}`}
                    rules={{ required: customField.required }}
                    control={control}
                    defaultValue={defaultValues?.customFields?.[customField._id as string] || ''}
                    render={({ field }) => (
                      <div className="field-wrap">
                        <CustomField
                          value={field.value}
                          onChange={field.onChange}
                          metadata={customField}
                        />
                      </div>
                    )}
                  />
                ))}
            </AccordionContent>
          </Accordion>
        ))}
      {!_.isEmpty(errors) && (
        <div className="form-errors">
          <p>{t('errors')}</p>
          <ul>
            {Object.keys(_.omit(errors, 'customFields')).map((item) => <li key={item}>{t(`user.${item}`)}</li>)}
            {Object.keys(errors.customFields || {}).map((item) => (
              <li key={item}>{customFields.find((customField) => customField._id === item)?.names[i18n.language]}</li>
            ))}
          </ul>
        </div>
      )}
    </ProfileFormWrapper>
  );
};

export default ProfileForm;
