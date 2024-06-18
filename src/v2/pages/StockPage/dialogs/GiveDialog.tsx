import React, { memo, useEffect, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Input } from 'v2/uikit';
import AutoComplete from 'v2/uikit/Autocomplete';
import DatePicker from 'v2/uikit/DatePicker';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';
import { EuroEndAdornment } from 'v2/uikit/Input';
import Loader from 'v2/uikit/Loader';
import Select from 'v2/uikit/Select';

import { useGetClients } from 'api/query/clientQuery';
import { useGetProperties } from 'api/query/propertyQuery';
import { useGetUserListForFilter } from 'api/query/userQuery';
import { IPropertyMovement } from 'interfaces/propertyMovement.interface';

import { movementExtendedToForm } from '../helpers';
import usePropertyMovementActions from '../Movements/hooks/useMovementActions';

import { DialogContentWrapper, LoaderWrapper } from './styles';

type Props = DialogProps & {
  defaultData?: IPropertyMovement<true>;
};

const GiveDialog = ({ defaultData, onClose, ...rest }: Props) => {
  const { t } = useTranslation();

  const { register, control, formState: { errors }, handleSubmit, watch, setValue, clearErrors } =
  useForm<IPropertyMovement>({ defaultValues: defaultData ? movementExtendedToForm(defaultData) : { type: 'give' } });

  const { data: users = [], isFetching: isFetchingUsers } = useGetUserListForFilter();
  const { data: recorders, isFetching: isFetchingRecorders } = useGetUserListForFilter({ isInternal: true });
  const { data: propertiesData = [], isFetching: isFetchingProperties } = useGetProperties({}, { staleTime: 0 });
  const properties: typeof propertiesData = useMemo(() => {
    if (defaultData?.property) {
      if (propertiesData.length) {
        return propertiesData.map((p) => {
          if (p._id === defaultData.property._id) {
            return {
              ...p,
              availableCount: p.availableCount + defaultData.count,
            };
          }
          return p;
        });
      } else {
        return [defaultData?.property] as typeof propertiesData;
      }
    }
    return propertiesData;
  }, [defaultData, propertiesData]);
  const { data: contractors = [], isFetching: isFetchingContractors } = useGetClients({ isInternal: true });
  const distributorNames = useMemo(() => Array.from(new Set(
    properties.map(item => item?.distributorName).filter(item => !!item),
  )), [properties]);
  const [distributorName, setDistrbutorName] = useState<string | null>(defaultData ? defaultData.property.distributorName || null : null);

  const { create, update } = usePropertyMovementActions();

  const submitHandler: SubmitHandler<IPropertyMovement> = (data) => {
    if (defaultData) {
      update(data);
    } else {
      create(data);
    }
    onClose();
  };

  const selectedPropertyId = watch('property');
  const selectedProperty = useMemo(() => properties.find(property => property._id === selectedPropertyId), [properties, selectedPropertyId]);

  useEffect(() => {
    if (selectedProperty) {
      setValue('damageCompencationPrice', selectedProperty?.damageCompencationPrice);
      clearErrors(['damageCompencationPrice']);
    }
  }, [clearErrors, selectedProperty, setValue]);

  const translatedType = t('selects.propertyMovementType.give');

  return (
    <Dialog
      mobileFullscreen
      title={defaultData ? `${defaultData?.property.internalName} ${translatedType}` : translatedType}
      onClose={onClose}
      {...rest}
    >
      <DialogContentWrapper>
        {(isFetchingProperties || isFetchingUsers || isFetchingRecorders || isFetchingContractors) && (
          <LoaderWrapper>
            <Loader />
          </LoaderWrapper>
        )}
        <div className="form">
          <Select
            label={t('stock.distributorName')}
            options={distributorNames}
            value={distributorName}
            onChange={(e) => void setDistrbutorName(e.target.value as string)}
            theme="gray"
            disabled={isFetchingProperties}
            required
          />
          {!!properties.length && (
            <Controller
              control={control}
              name="property"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <AutoComplete
                  label={t('stock.property')}
                  options={properties.filter(p => p.distributorName === distributorName && p.availableCount)}
                  defaultValue={properties.find(item => item._id === field.value)}
                  onChange={(v) => void field.onChange(v?._id)}
                  theme="gray"
                  getOptionLabel={row => `${row.internalName} (${row.availableCount})`}
                  valueKey="_id"
                  disabled={isFetchingProperties || !distributorName}
                  required
                  error={!!fieldState.error}
                />
              )}
            />
          )}
          {!!contractors.length && (
            <Controller
              control={control}
              name="contractor"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Select
                  label={t('stock.contractor')}
                  options={contractors}
                  onChange={(e) => void field.onChange(e.target.value)}
                  theme="gray"
                  labelPath="shortName"
                  valuePath="_id"
                  required
                  error={!!fieldState.error}
                  value={field.value}
                  disabled={!distributorName}
                />
              )}
            />
          )}
          {!!selectedProperty && (
            <>
              <Input
                label={t('stock.distributorICO')}
                value={selectedProperty.distributorICO}
                disabled
              />
              <Input
                label={t('stock.orderer')}
                value={selectedProperty.orderer.shortName}
                disabled
              />
              <Input
                label={t('stock.price')}
                value={selectedProperty.price}
                InputProps={{ endAdornment: EuroEndAdornment }}
                disabled
              />
              <Input
                label={t('stock.damageCompencationPrice')}
                value={selectedProperty.damageCompencationPrice}
                InputProps={{ endAdornment: EuroEndAdornment }}
                disabled
              />
              <Input
                label={t('stock.receiver')}
                value={selectedProperty.receiver.fullname}
                disabled
              />
              <Input
                label={t('stock.size')}
                value={selectedProperty.size}
                disabled
              />
            </>
          )}
          {!!users.length && (
            <Controller
              control={control}
              name="user"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <AutoComplete
                  label={t('stock.user')}
                  options={users}
                  defaultValue={users.find(user => user._id === field.value)}
                  onChange={(v) => void field.onChange(v?._id)}
                  theme="gray"
                  getOptionLabel={row => `${row.fullname}${row.project ? `, ${row.project.client.shortName} > ${row.project.name}` : ''}`}
                  valueKey="_id"
                  disabled={isFetchingUsers || !distributorName}
                  required
                  error={!!fieldState.error}
                />
              )}
            />
          )}
          <Input
            label={`${t('stock.count')} (max. ${selectedProperty?.availableCount || 0})`}
            theme="gray"
            type="number"
            error={!!errors.count}
            disabled={!distributorName}
            required
            {...register('count', {
              required: true,
              validate: {
                limit: (value) => {
                  const count = Number(value);
                  if (selectedProperty) {
                    return count <= selectedProperty.availableCount;
                  }
                  return false;
                },
              },
            })}
          />
          <Controller
            control={control}
            name="date"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <DatePicker
                label={t('stock.date')}
                inputProps={{ theme: 'gray', required: true }}
                onChange={field.onChange}
                defaultValue={field.value}
                error={!!fieldState.error}
                disabled={!distributorName}
              />
            )}
          />
          {!!recorders?.length && (
            <Controller
              control={control}
              name="recorder"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Select
                  label={t('stock.recorder')}
                  options={recorders}
                  value={field.value}
                  onChange={(e) => void field.onChange(e.target.value)}
                  theme="gray"
                  labelPath="fullname"
                  valuePath="_id"
                  required
                  error={!!fieldState.error}
                  disabled={!distributorName}
                />
              )}
            />
          )}
        </div>
      </DialogContentWrapper>
      <DialogActions>
        <Button variant="contained" onClick={handleSubmit(submitHandler)}>{t('save')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(GiveDialog);
