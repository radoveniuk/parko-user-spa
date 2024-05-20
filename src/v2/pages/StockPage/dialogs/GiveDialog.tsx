import React, { memo, useEffect, useMemo } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Input } from 'v2/uikit';
import AutoComplete from 'v2/uikit/Autocomplete';
import DatePicker from 'v2/uikit/DatePicker';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';
import Select from 'v2/uikit/Select';

import { useGetClients } from 'api/query/clientQuery';
import { useGetProperties } from 'api/query/propertyQuery';
import { useGetUserListForFilter } from 'api/query/userQuery';
import { IPropertyMovement } from 'interfaces/propertyMovement.interface';

import { movementExtendedToForm } from '../helpers';
import usePropertyMovementActions from '../Movements/hooks/useMovementActions';

import { DialogContentWrapper } from './styles';

type Props = DialogProps & {
  defaultData?: IPropertyMovement<true>;
};

const GiveDialog = ({ defaultData, onClose, ...rest }: Props) => {
  const { t } = useTranslation();

  const { register, control, formState: { errors }, handleSubmit, watch, setValue, clearErrors } =
  useForm<IPropertyMovement>({ defaultValues: defaultData ? movementExtendedToForm(defaultData) : { type: 'give' } });

  const { data: users = [], isFetching: isFetchingUsers } = useGetUserListForFilter();
  const { data: recorders } = useGetUserListForFilter({ isInternal: true });
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
  const { data: contractors = [] } = useGetClients({ isInternal: true });

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
        <div className="form">
          {!!properties.length && (
            <Controller
              control={control}
              name="property"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <AutoComplete
                  label={t('stock.property')}
                  options={properties}
                  value={properties.find(item => item._id === field.value)}
                  onChange={(v) => void field.onChange(v?._id)}
                  theme="gray"
                  getOptionLabel={row => `${row.internalName} (${row.availableCount})`}
                  valueKey="_id"
                  disabled={isFetchingProperties}
                  required
                  error={!!fieldState.error}
                  getOptionDisabled={item => !item.availableCount}
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
                InputProps={{ endAdornment: <div style={{ width: 24 }}>€</div> }}
                disabled
              />
              <Input
                label={t('stock.damageCompencationPrice')}
                value={selectedProperty.damageCompencationPrice}
                InputProps={{ endAdornment: <div style={{ width: 24 }}>€</div> }}
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
          <Controller
            control={control}
            name="user"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <AutoComplete
                label={t('stock.user')}
                options={users}
                value={users.find(user => user._id === field.value)}
                onChange={(v) => void field.onChange(v?._id)}
                theme="gray"
                getOptionLabel={row => `${row.fullname}${row.project ? `, ${row.project.client.shortName} > ${row.project.name}` : ''}`}
                valueKey="_id"
                disabled={isFetchingUsers}
                required
                error={!!fieldState.error}
                key={defaultData?.user._id}
              />
            )}
          />
          <Input
            label={`${t('stock.count')} (max. ${selectedProperty?.availableCount || 0})`}
            theme="gray"
            type="number"
            error={!!errors.count}
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
              />
            )}
          />
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
              />
            )}
          />
        </div>
      </DialogContentWrapper>
      <DialogActions>
        <Button variant="contained" onClick={handleSubmit(submitHandler)}>{t('save')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(GiveDialog);
