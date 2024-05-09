import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Autocomplete from 'v2/uikit/Autocomplete';
import DatePicker from 'v2/uikit/DatePicker';
import IconButton from 'v2/uikit/IconButton';
import Input from 'v2/uikit/Input';
import PhoneInput, { checkPhoneNumber } from 'v2/uikit/PhoneInput';
import Select from 'v2/uikit/Select';

import { useGetUserListForFilter } from 'api/query/userQuery';
import { SaveIcon } from 'components/icons';
import { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { CLIENT_STATUS } from 'constants/selectsOptions';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IClient } from 'interfaces/client.interface';

import { useClientRowContext } from './context';
import { FormFieldWrapper, LinkWrapper } from './styles';

const EditingRow = () => {
  const { data, cols, saveEdit } = useClientRowContext();
  const { register, formState: { errors }, control, handleSubmit } = useForm<IClient>();

  const { data: managers = [] } = useGetUserListForFilter({ permissions: 'users:update' });
  const statuses = useTranslatedSelect(CLIENT_STATUS, 'clientStatus', true, false);

  const generateField = (fieldName: keyof IClient) => {
    const textFields: (keyof IClient)[] = ['DIC', 'ICDPH', 'ICO', 'comment', 'contactPerson',
      'contactPersonPosition', 'email', 'shortName', 'sidlo', 'websiteUrl'];
    const dateFields: (keyof IClient)[] = ['cooperationStartDate', 'cooperationEndDate'];
    const fieldValue = data[fieldName];
    return (
      <FormFieldWrapper>
        {textFields.includes(fieldName) && (
          <Input
            variant="standard"
            defaultValue={fieldValue as string}
            error={!!errors[fieldName]}
            helperText={errors?.[fieldName] && (errors?.[fieldName] as any).message}
            {...register(fieldName)}
          />
        )}
        {fieldName === 'phone' && (
          <Controller
            control={control}
            name={fieldName}
            defaultValue={fieldValue as string}
            rules={{ validate: (value) => !value || checkPhoneNumber(value as string) }}
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
        {dateFields.includes(fieldName) && (
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
        {fieldName === 'status' && (
          <Select options={statuses} defaultValue={data?.status} {...register('status')} />
        )}
        {fieldName === 'managers' && (
          <Controller
            control={control}
            name="managers"
            render={({ field }) => (
              <Autocomplete
                defaultValue={data && data.managers ? data.managers : []}
                multiple
                valueKey="_id"
                options={managers}
                labelKey="fullname"
                onChange={field.onChange}
                disableCloseOnSelect
                limitTags={1}
              />
            )}
          />
        )}
      </FormFieldWrapper>
    );
  };

  const submitHandler: SubmitHandler<IClient> = async (values) => {
    saveEdit({ ...data, ...values });
  };

  return (
    <ListTableRow>
      <ListTableCell>
        <LinkWrapper>
          <Link to={`/clients/${data._id}`} className="table-link">
            {data.shortName || data.name}
          </Link>
        </LinkWrapper>
      </ListTableCell>
      {cols.map((colName) => {
        const clientField = colName.replace('client.', '') as keyof IClient;
        return <ListTableCell key={colName}>{generateField(clientField)}</ListTableCell>;
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
