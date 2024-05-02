import React, { useMemo } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import cloneDeep from 'lodash-es/cloneDeep';
import get from 'lodash-es/get';
import omit from 'lodash-es/omit';
import set from 'lodash-es/set';
import { USER_WORK_TYPES } from 'v2/constants/userWorkTypes';
import Autocomplete from 'v2/uikit/Autocomplete';
import Checkbox from 'v2/uikit/Checkbox';
import DatePicker from 'v2/uikit/DatePicker';
import IconButton from 'v2/uikit/IconButton';
import Input from 'v2/uikit/Input';
import PhoneInput, { checkPhoneNumber } from 'v2/uikit/PhoneInput';
import Select from 'v2/uikit/Select';

import { useGetDictionary } from 'api/query/dictionariesQuery';
import CustomField from 'components/complex/CustomField';
import { SaveIcon } from 'components/icons';
import BooleanSelect from 'components/shared/BooleanSelect';
import { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { CORPORATE_BODY_STATUS, EMPLOYMENT_TYPE, FAMILY_STATUSES, INSURANCE, PERMIT_TYPES, SIZES } from 'constants/selectsOptions';
import { USER_STATUSES } from 'constants/statuses';
import { ALL_FORM_FIELDS } from 'constants/userFormFields';
import { isMongoId } from 'helpers/regex';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { AnyObject } from 'interfaces/base.types';
import { ICustomFormField, ICustomFormFieldSectionBinding } from 'interfaces/form.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import { useProfileRowContext } from './context';
import { FormFieldWrapper, LinkWrapper } from './styles';

const EditingRow = () => {
  const { t } = useTranslation();
  const { data, selected, onChangeSelect, cols, saveEdit, style } = useProfileRowContext();
  const { register, formState: { errors }, control, handleSubmit } = useForm<IUser>();
  const queryClient = useQueryClient();
  // options
  const recruiters = queryClient.getQueryData(['users', JSON.stringify({ permissions: 'users:update' })]) as IUser[];
  const { data: sourceDictionary } = useGetDictionary('PROFILE_SOURCE');
  const { data: permitTypeDictionary } = useGetDictionary('PERMIT_TYPES');
  const { data: cooperationTypeDictionary } = useGetDictionary('PROFILE_COOPERATION_TYPES');
  const { data: profilePositionDictionary } = useGetDictionary('PROFILE_POSITIONS');
  const { data: countryDictionary } = useGetDictionary('COUNTRIES');
  const employmentTypeOptions = useTranslatedSelect(EMPLOYMENT_TYPE, 'employmentType');
  const sexOptions = useTranslatedSelect(['male', 'female']);
  const translatedStatuses = useTranslatedSelect(USER_STATUSES, 'userStatus');
  const corporateBodyStatusOptions = useTranslatedSelect(CORPORATE_BODY_STATUS, 'corporateBodyStatus');
  const familyStatusOptions = useTranslatedSelect(FAMILY_STATUSES, 'familyStatus');
  const translatedPermitTypes = useTranslatedSelect(PERMIT_TYPES, 'permitType');
  const translatedWorkTypes = useTranslatedSelect(USER_WORK_TYPES, 'userWorkType');

  const customFields: ICustomFormFieldSectionBinding<true>[] = queryClient.getQueryData(['customFormFieldSectionBindings', JSON.stringify({})]) || [];

  const selectOptions: AnyObject = useMemo(() => ({
    pantsSize: SIZES,
    tshortSize: SIZES,
    sex: sexOptions,
    employmentType: employmentTypeOptions,
    status: translatedStatuses,
    businessStatus: corporateBodyStatusOptions,
    familyStatus: familyStatusOptions,
    medicalInsurance: INSURANCE,
    workTypes: translatedWorkTypes,
    'permit.goal': translatedPermitTypes,
  }), [corporateBodyStatusOptions, employmentTypeOptions, familyStatusOptions, sexOptions,
    translatedPermitTypes, translatedStatuses, translatedWorkTypes]);

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
    country: {
      options: countryDictionary?.options?.map((item) => ({ _id: item, label: item })) || [],
      labelPath: 'label',
    },
    'pass.country': {
      options: countryDictionary?.options?.map((item) => ({ _id: item, label: item })) || [],
      labelPath: 'label',
    },
    'idcard.country': {
      options: countryDictionary?.options?.map((item) => ({ _id: item, label: item })) || [],
      labelPath: 'label',
    },
  }), [
    countryDictionary?.options, cooperationTypeDictionary?.options, permitTypeDictionary?.options, profilePositionDictionary?.options,
    recruiters, sourceDictionary?.options,
  ]);

  const generateField = (fieldName: keyof IUser) => {
    const fieldData = ALL_FORM_FIELDS[fieldName];
    let fieldValue = data?.[fieldName] || '';
    if (typeof data?.[fieldName] === 'object' && !Array.isArray(data?.[fieldName])) {
      fieldValue = (data?.[fieldName] as AnyObject)?._id || '';
    }
    if (/\b(?:idcard.|visa.|permit.|pass.)\b/i.test(fieldName)) {
      const docType = fieldName.split('.')[0];
      const docValueKey = fieldName.split('.')[1];
      const doc = data.docs?.find(doc => doc.type === docType);
      fieldValue = doc?.[docValueKey] || '';
    }
    return (
      <FormFieldWrapper style={style}>
        {(fieldData?.type === 'string' || fieldData?.type === 'number' || fieldData?.type === 'textarea') && (
          <Input
            variant="standard"
            type={fieldData.type}
            defaultValue={fieldValue}
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
            defaultValue={fieldValue}
            rules={{ validate: (value) => !value || checkPhoneNumber(value as string), required: fieldData.required }}
            render={({ field }) => (
              <PhoneInput
                variant="standard"
                value={field.value as string}
                onChange={field.onChange}
                error={!!errors.phone}
              />
            )}
          />
        )}
        {fieldData?.type === 'boolean' && (
          <Controller
            control={control}
            name={fieldName}
            defaultValue={fieldValue}
            render={({ field }) => (
              <BooleanSelect
                defaultValue={field.value as boolean}
                onChange={field.onChange}
              />
            )}
          />
        )}
        {fieldData?.type === 'date' && (
          <Controller
            control={control}
            name={fieldName}
            defaultValue={fieldValue}
            render={({ field }) => (
              <DatePicker
                inputProps={{ variant: 'standard' }}
                defaultValue={field.value as string}
                onChange={field.onChange}
              />
            )}
          />
        )}
        {(fieldData?.type === 'select' && selectOptions[fieldName]) && (
          <Select
            options={selectOptions[fieldName] || []}
            defaultValue={fieldValue}
            style={{ minWidth: 200 }}
            error={!!errors[fieldName]}
            {...register(fieldName, {
              required: fieldData.required,
            })}
            {...fieldData.selectProps}
          />
        )}
        {(fieldData?.type === 'multiselect' && selectOptions[fieldName]) && (
          <Controller
            key={customFields.find((customField) => customField._id === fieldName)?._id}
            name={fieldName}
            control={control}
            defaultValue={fieldValue}
            render={({ field }) => (
              <Autocomplete
                multiple
                options={selectOptions[fieldName] || []}
                labelKey="label"
                valueKey="_id"
                value={selectOptions[fieldName].filter((selectOption: { _id: string; }) => (field.value as string[])?.includes(selectOption._id))}
                onChange={(v) => void field.onChange(v.map((item: { _id: string; }) => item._id))}
                style={{ minWidth: 200 }}
                error={!!errors[fieldName]}
              />
            )}
          />
        )}
        {(fieldData?.type === 'dynamic-select' && !!dynamicSelectOptions[fieldName]?.options?.length) && (
          <Select
            options={dynamicSelectOptions[fieldName].options || []}
            defaultValue={fieldValue}
            style={{ minWidth: 200 }}
            error={!!errors[fieldName]}
            valuePath="_id"
            labelPath={dynamicSelectOptions[fieldName].labelPath}
            {...register(fieldName, { required: fieldData.required })}
            {...fieldData.selectProps}
          />
        )}
        {fieldData?.type === 'readonly' && (fieldName as string) === 'role' && (
          <div>{fieldData.render?.(data?.roles, t)}</div>
        )}
        {fieldData?.type === 'readonly' && !['client', 'role'].includes(fieldName as string) && (
          <div>{fieldData.render?.(data?.[fieldName], t)}</div>
        )}
        {fieldData?.type === 'readonly' && ['client', 'clientCompany'].includes(fieldName as string) && (
          <div>{fieldData.render?.((data?.project as IProject)?.client, t)}</div>
        )}
        {isMongoId(fieldName) && customFields.some((customField) => customField._id === fieldName) && (
          <Controller
            key={customFields.find((customField) => customField._id === fieldName)?._id}
            name={`customFields.${customFields.find((customField) => customField._id === fieldName)?._id}`}
            control={control}
            defaultValue={data?.customFields?.[customFields.find((customField) => customField._id === fieldName)?._id as string]}
            render={({ field }) => (
              <CustomField
                value={field.value}
                onChange={field.onChange}
                metadata={customFields.find((customField) => customField._id === fieldName)?.field as ICustomFormField}
                label=""
                variant="standard"
              />
            )}
          />
        )}
      </FormFieldWrapper>
    );
  };

  const submitHandler: SubmitHandler<IUser> = async (values) => {
    const docs = cloneDeep(data.docs);
    const docKeys = ['idcard', 'visa', 'permit', 'pass'];

    Object.keys(values).forEach((valueKey) => {
      if (docKeys.includes(valueKey)) {
        const docItem = docs?.find((doc) => doc.type === valueKey);
        const docItemUpdates = get(values, valueKey) as AnyObject;
        if (!docItem) {
          docs?.push({ type: valueKey as any, ...docItemUpdates });
        } else {
          Object.keys(docItemUpdates).forEach((docKey) => {
            set(docItem, docKey, docItemUpdates[docKey]);
          });
        }
      }
    });

    const updatedUserData = {
      ...data,
      ...omit(values, docKeys),
      docs,
      project: values.project?.toString() || (data.project as IProject)?._id || null,
      recruiter: values.recruiter?.toString() || null,
    };
    if (!updatedUserData.password) {
      delete updatedUserData.password;
    }
    saveEdit(updatedUserData);
  };

  return (
    <ListTableRow>
      <ListTableCell>
        <Checkbox checked={selected} onChange={(e) => void onChangeSelect(e.target.checked)} />
      </ListTableCell>
      <ListTableCell>
        <LinkWrapper>
          <Link to={`/profile/${data._id}`} className="table-link">
            {data.name} {data.surname}
          </Link>
        </LinkWrapper>
      </ListTableCell>
      {cols.map((colName) => {
        const userField = colName.replace('user.', '') as keyof IUser;
        return <ListTableCell key={colName}>{generateField(userField)}</ListTableCell>;
      })}
      <ListTableCell>
        <IconButton
          className="fast-edit-profile active"
          aria-label="fast edit profile"
          onClick={handleSubmit(submitHandler)}
        >
          <SaveIcon />
        </IconButton>
      </ListTableCell>
    </ListTableRow>
  );
};

export default EditingRow;
