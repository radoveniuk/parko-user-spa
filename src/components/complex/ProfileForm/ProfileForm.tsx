import React, { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import _ from 'lodash-es';

import { useGetCustomFormFields, useGetCustomFormSections } from 'api/query/customFormsQuery';
import { useGetDictionary } from 'api/query/dictionariesQuery';
import { useGetUserList } from 'api/query/userQuery';
import Accordion from 'components/shared/Accordion';
import BooleanSelect from 'components/shared/BooleanSelect';
import DatePicker from 'components/shared/DatePicker';
import Input from 'components/shared/Input';
import PhoneInput, { checkPhoneNumber } from 'components/shared/PhoneInput';
import Select from 'components/shared/Select';
import { COUNTRIES } from 'constants/countries';
import { EMPLOYMENT_TYPE, FAMILY_STATUSES, SIZES, STUDY } from 'constants/selectsOptions';
import { useAuthData } from 'contexts/AuthContext';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { AnyObject } from 'interfaces/base.types';
import { IUser } from 'interfaces/users.interface';

import CustomField from '../CustomField';

import {
  ADRESS_FIELDS, BASE_FIELDS, BIOMETRY_FIELDS, BUSINESS_FIELDS,
  PERMIT_FIELDS, SYSTEM_FIELDS, UserField, UserFieldsList, WORK_FIELDS,
} from './fields';
import { AccordionFieldsWrapper, ProfileFormWrapper } from './styles';

type Props = {
  defaultValues?: IUser;
}

const ProfileForm = ({ defaultValues }: Props) => {
  const { register, formState: { errors }, control } = useFormContext<IUser>();
  const { t, i18n } = useTranslation();
  const { role } = useAuthData();

  // options
  const { data: recruiters = [] } = useGetUserList({ role: 'recruiter' });
  const { data: sourceDictionary } = useGetDictionary('PROFILE_SOURCE');
  const { data: permitTypeDictionary } = useGetDictionary('PERMIT_TYPES');
  const { data: cooperationTypeDictionary } = useGetDictionary('PROFILE_COOPERATION_TYPES');
  const { data: profilePositionDictionary } = useGetDictionary('PROFILE_POSITIONS');
  const familyStateOptions = useTranslatedSelect(FAMILY_STATUSES, 'familyStatus');
  const studyOptions = useTranslatedSelect(STUDY, 'study');
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
    country: COUNTRIES.sort(),
    familyState: familyStateOptions,
    study: studyOptions,
    sex: sexOptions,
    employmentType: employmentTypeOptions,
  }), [employmentTypeOptions, familyStateOptions, sexOptions, studyOptions]);

  const dynamicSelectOptions: AnyObject = useMemo(() => ({
    recruiter: {
      options: recruiters.map((item) => ({ _id: item._id, label: `${item.name} ${item.surname}` })),
      labelPath: 'label',
    },
    source: {
      options: sourceDictionary?.options?.map((item) => ({ _id: item, label: item })) || [],
      labelPath: 'label',
    },
    permitType: {
      options: permitTypeDictionary?.options?.map((item) => ({ _id: item, label: item })) || [],
      labelPath: 'label',
    },
    cooperationType: {
      options: cooperationTypeDictionary?.options?.map((item) => ({ _id: item, label: item })) || [],
      labelPath: 'label',
    },
    position: {
      options: profilePositionDictionary?.options?.map((item) => ({ _id: item, label: item })) || [],
      labelPath: 'label',
    },
  }), [cooperationTypeDictionary?.options, permitTypeDictionary?.options, profilePositionDictionary?.options, recruiters, sourceDictionary?.options]);

  const generateAccordionContent = (fields: UserFieldsList) => {
    const generateField = (fieldName: keyof IUser, fieldData: UserField | undefined) => (
      <>
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
        {(fieldData?.type === 'textarea') && (
          <Input
            className="textarea"
            type={fieldData.type}
            label={t(`user.${fieldName}`)}
            defaultValue={defaultValues?.[fieldName] || ''}
            error={!!errors[fieldName]}
            multiline
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
        {(fieldData?.type === 'dynamic-select' && dynamicSelectOptions[fieldName]?.options?.length) && (
          <Select
            options={dynamicSelectOptions[fieldName].options || []}
            defaultValue={defaultValues?.[fieldName] || ''}
            label={t(`user.${fieldName}`)}
            style={{ minWidth: 200 }}
            error={!!errors[fieldName]}
            valuePath="_id"
            labelPath={dynamicSelectOptions[fieldName].labelPath}
            {...register(fieldName, {
              required: fieldData.required,
            })}
          />
        )}
      </>
    );
    return (
      <>
        {(Object.keys(fields) as (keyof IUser)[]).map((fieldKey) => {
          const fieldData = fields[fieldKey];
          if (fieldData?.permissionRoles === undefined || fieldData.permissionRoles.includes(role as string)) {
            return (
              <React.Fragment key={fieldKey}>
                {generateField(fieldKey, fieldData)}
              </React.Fragment>
            );
          }
          return null;
        })}
      </>
    );
  };

  return (
    <ProfileFormWrapper>
      <Accordion
        title={t('user.baseFields')}
        defaultExpanded
      >
        <AccordionFieldsWrapper cols={3}>
          {generateAccordionContent(BASE_FIELDS)}
        </AccordionFieldsWrapper>
      </Accordion>
      <Accordion
        title={t('user.adressFields')}
        defaultExpanded
      >
        <AccordionFieldsWrapper cols={2}>
          {generateAccordionContent(ADRESS_FIELDS)}
        </AccordionFieldsWrapper>
      </Accordion>
      {['admin', 'recruiter'].includes(role as string) && (
        <Accordion
          title={t('user.systemFields')}
          defaultExpanded
        >
          <AccordionFieldsWrapper cols={2}>
            {generateAccordionContent(SYSTEM_FIELDS)}
          </AccordionFieldsWrapper>
        </Accordion>
      )}
      <Accordion
        title={t('user.permitFields')}
        defaultExpanded
      >
        <AccordionFieldsWrapper cols={3}>
          {generateAccordionContent(PERMIT_FIELDS)}
        </AccordionFieldsWrapper>
      </Accordion>
      <Accordion
        title={t('user.businessFields')}
        defaultExpanded
      >
        <AccordionFieldsWrapper cols={3}>
          {generateAccordionContent(BUSINESS_FIELDS)}
        </AccordionFieldsWrapper>
      </Accordion>
      <Accordion
        title={t('user.biometryFields')}
        defaultExpanded
      >
        <AccordionFieldsWrapper cols={3}>
          {generateAccordionContent(BIOMETRY_FIELDS)}
        </AccordionFieldsWrapper>
      </Accordion>
      {['admin', 'recruiter'].includes(role as string) && (
        <Accordion
          title={t('user.workFields')}
          defaultExpanded
        >
          <AccordionFieldsWrapper cols={2}>
            {generateAccordionContent(WORK_FIELDS)}
          </AccordionFieldsWrapper>
        </Accordion>
      )}
      {customSections
        .filter((section) => customFields.some((customField) => customField.section === section._id))
        .map((section) => (
          <Accordion
            key={section._id}
            title={section.names[i18n.language]}
            id={section._id}
            className="accordion"
            defaultExpanded
          >
            <AccordionFieldsWrapper cols={3}>
              {customFields
                .filter((customField) => customField.section === section._id)
                .map((customField) => (
                  <Controller
                    key={customField._id}
                    name={`customFields.${customField._id}`}
                    rules={{ required: customField.required }}
                    control={control}
                    defaultValue={defaultValues?.customFields?.[customField._id as string]}
                    render={({ field }) => (
                      <CustomField
                        value={field.value}
                        onChange={field.onChange}
                        metadata={customField}
                      />
                    )}
                  />
                ))}
            </AccordionFieldsWrapper>
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
