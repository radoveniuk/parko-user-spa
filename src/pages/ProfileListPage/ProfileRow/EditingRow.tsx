import React, { useMemo } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useGetCustomFormFields } from 'api/query/customFormsQuery';
import { useGetDictionary } from 'api/query/dictionariesQuery';
import { useGetProjects } from 'api/query/projectQuery';
import { useGetUserList } from 'api/query/userQuery';
import CustomField from 'components/complex/CustomField';
import { SaveIcon } from 'components/icons';
import BooleanSelect from 'components/shared/BooleanSelect';
import Checkbox from 'components/shared/Checkbox';
import DatePicker from 'components/shared/DatePicker';
import IconButton from 'components/shared/IconButton';
import Input from 'components/shared/Input';
import { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import PhoneInput, { checkPhoneNumber } from 'components/shared/PhoneInput';
import Select from 'components/shared/Select';
import { EMPLOYMENT_TYPE, SIZES } from 'constants/selectsOptions';
import { USER_STATUSES } from 'constants/statuses';
import { ALL_FORM_FIELDS } from 'constants/userFormFields';
import { ROLES } from 'constants/userRoles';
import { isMongoId } from 'helpers/regex';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { AnyObject } from 'interfaces/base.types';
import { ICustomFormField } from 'interfaces/form.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import { useProfileRowContext } from './context';
import { FormFieldWrapper } from './styles';

const EditingRow = () => {
  const { t } = useTranslation();
  const { data, selected, onChangeSelect, cols, saveEdit } = useProfileRowContext();
  const { register, formState: { errors }, control, handleSubmit } = useForm<IUser>();

  // options
  const { data: projects = [] } = useGetProjects();
  const { data: recruiters = [] } = useGetUserList({ role: 'recruiter' });
  const { data: sourceDictionary } = useGetDictionary('PROFILE_SOURCE');
  const { data: permitTypeDictionary } = useGetDictionary('PERMIT_TYPES');
  const { data: cooperationTypeDictionary } = useGetDictionary('PROFILE_COOPERATION_TYPES');
  const { data: profilePositionDictionary } = useGetDictionary('PROFILE_POSITIONS');
  const { data: countryDictionary } = useGetDictionary('COUNTRIES');
  const employmentTypeOptions = useTranslatedSelect(EMPLOYMENT_TYPE, 'employmentType');
  const sexOptions = useTranslatedSelect(['male', 'female']);
  const translatedStatuses = useTranslatedSelect(USER_STATUSES, 'userStatus');
  const translatedRoles = useTranslatedSelect(ROLES, 'userRole');

  const { data: customFields = [] } = useGetCustomFormFields({ entity: 'user' });

  const selectOptions: AnyObject = useMemo(() => ({
    pantsSize: SIZES,
    tshortSize: SIZES,
    sex: sexOptions,
    employmentType: employmentTypeOptions,
    status: translatedStatuses,
    role: translatedRoles,
  }), [employmentTypeOptions, sexOptions, translatedRoles, translatedStatuses]);

  const dynamicSelectOptions: AnyObject = useMemo(() => ({
    project: {
      options: projects,
      labelPath: 'name',
    },
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
  }), [
    countryDictionary?.options, cooperationTypeDictionary?.options, permitTypeDictionary?.options, profilePositionDictionary?.options,
    projects, recruiters, sourceDictionary?.options,
  ]);

  const generateField = (fieldName: keyof IUser) => {
    const fieldData = ALL_FORM_FIELDS[fieldName];
    return (
      <FormFieldWrapper>
        {(fieldData?.type === 'string' || fieldData?.type === 'number') && (
          <Input
            type={fieldData.type}
            label={t(`user.${fieldName}`)}
            defaultValue={data?.[fieldName] || ''}
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
            type={fieldData.type}
            label={t(`user.${fieldName}`)}
            defaultValue={data?.[fieldName] || ''}
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
            defaultValue={data?.[fieldName] || ''}
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
            defaultValue={typeof data?.[fieldName] === 'boolean' ? data?.[fieldName] : undefined}
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
            defaultValue={data?.[fieldName] || ''}
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
            defaultValue={data?.[fieldName] || ''}
            label={t(`user.${fieldName}`)}
            style={{ minWidth: 200 }}
            error={!!errors[fieldName]}
            {...register(fieldName, {
              required: fieldData.required,
            })}
            {...fieldData.selectProps}
          />
        )}
        {(fieldData?.type === 'dynamic-select' && !!dynamicSelectOptions[fieldName]?.options?.length) && (
          <Select
            options={dynamicSelectOptions[fieldName].options || []}
            defaultValue={typeof data?.[fieldName] === 'object' ? (data?.[fieldName] as AnyObject)?._id || '' : data?.[fieldName]}
            label={t(`user.${fieldName}`)}
            style={{ minWidth: 200 }}
            error={!!errors[fieldName]}
            valuePath="_id"
            labelPath={dynamicSelectOptions[fieldName].labelPath}
            {...register(fieldName, { required: fieldData.required })}
            {...fieldData.selectProps}
          />
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
                metadata={customFields.find((customField) => customField._id === fieldName) as ICustomFormField}
              />
            )}
          />
        )}
      </FormFieldWrapper>
    );
  };

  const submitHandler: SubmitHandler<IUser> = async (values) => {
    const updatedUserData = {
      ...data,
      ...values,
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
        <Link to={`/profile/${data._id}`} className="table-link">
          {data.name} {data.surname}
        </Link>
      </ListTableCell>
      {cols.map((colName) => {
        const userField = colName.replace('user.', '') as keyof IUser;
        return <ListTableCell key={colName}>{generateField(userField)}</ListTableCell>;
      })}
      <ListTableCell>
        <IconButton
          className="fast-edit-profile active"
          onClick={handleSubmit(submitHandler)}
        >
          <SaveIcon />
        </IconButton>
      </ListTableCell>
    </ListTableRow>
  );
};

export default EditingRow;
