import React, { memo, useMemo } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Input } from 'v2/uikit';
import AutocompleteTextField from 'v2/uikit/AutocompleteTextField';
import DatePicker from 'v2/uikit/DatePicker';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';
import { EuroEndAdornment } from 'v2/uikit/Input';
import Select from 'v2/uikit/Select';

import { useGetClients } from 'api/query/clientQuery';
import { useGetProperties } from 'api/query/propertyQuery';
import { useGetUserListForFilter } from 'api/query/userQuery';
import { SIZES } from 'constants/selectsOptions';
import { IProperty } from 'interfaces/property.interface';

import usePropertyActions from '../Properties/hooks/usePropertyActions';

import { DialogContentWrapper } from './styles';

type Props = DialogProps & {
  defaultData?: IProperty<true>
};

const PropertyFormDialog = ({ defaultData, onClose, ...rest }: Props) => {
  const prepareDefaultData = (data: IProperty<true>): IProperty => {
    const result: IProperty = {
      ...data,
      orderer: data.orderer._id,
      receiver: data.receiver._id,
    };
    return result as IProperty;
  };

  const { t } = useTranslation();

  const { register, control, formState: { errors }, handleSubmit, watch, setValue, clearErrors } =
  useForm<IProperty>({ defaultValues: defaultData ? prepareDefaultData(defaultData) : {} });

  const { data: prevProperties = [] } = useGetProperties();
  const prevInternalNames = useMemo(() => Array.from(new Set(prevProperties.map(item => item.internalName))), [prevProperties]);
  const prevTradeNames = useMemo(() => Array.from(new Set(prevProperties.map(item => item.tradeName))), [prevProperties]);
  const prevDistributors = useMemo(() => Array.from(new Set(prevProperties.map(item => item.distributorICO))), [prevProperties]);
  const prevDistributorNames = useMemo(() => Array.from(new Set(
    prevProperties.map(item => item?.distributorName).filter(item => !!item),
  )), [prevProperties]);
  const prevLocations = useMemo(() => Array.from(new Set(prevProperties.map(item => item.location))), [prevProperties]);
  // eslint-disable-next-line max-len
  const prevCategories = useMemo(() => Array.from(new Set(['Clothes', 'Shoes', ...prevProperties.filter(item => item.category).map(item => item.category)])), [prevProperties]);

  const { data: clients } = useGetClients({ isInternal: true });
  const { data: receivers } = useGetUserListForFilter({ isInternal: true });

  const { create, update } = usePropertyActions();

  const submitHandler: SubmitHandler<IProperty> = (data) => {
    if (defaultData) {
      update(data);
    } else {
      create(data);
    }
    onClose();
  };

  return (
    <Dialog
      mobileFullscreen
      title={defaultData?.internalName || t('stock.property')}
      onClose={onClose}
      {...rest}
    >
      <DialogContentWrapper>
        <div className="form">
          <Controller
            control={control}
            name="internalName"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <AutocompleteTextField
                label={t('stock.internalName')}
                options={prevInternalNames}
                theme="gray"
                required
                onChange={field.onChange}
                value={field.value}
                error={!!fieldState.error}
                ref={field.ref}
              />
            )}
          />
          <Controller
            control={control}
            name="tradeName"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <AutocompleteTextField
                label={t('stock.tradeName')}
                options={prevTradeNames}
                theme="gray"
                required
                onChange={field.onChange}
                value={field.value}
                error={!!fieldState.error}
                ref={field.ref}
              />
            )}
          />
          <Controller
            control={control}
            name="distributorICO"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <AutocompleteTextField
                label={t('stock.distributorICO')}
                options={prevDistributors}
                theme="gray"
                required
                onChange={field.onChange}
                value={field.value}
                error={!!fieldState.error}
                ref={field.ref}
              />
            )}
          />
          <Controller
            control={control}
            name="distributorName"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <AutocompleteTextField
                label={t('stock.distributorName')}
                options={prevDistributorNames}
                theme="gray"
                required
                onChange={field.onChange}
                value={field.value}
                error={!!fieldState.error}
                ref={field.ref}
              />
            )}
          />
          <Controller
            control={control}
            name="invoiceDeliveryDate"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <DatePicker
                label={t('stock.invoiceDeliveryDate')}
                inputProps={{ theme: 'gray' }}
                onChange={field.onChange}
                defaultValue={field.value}
                error={!!fieldState.error}
              />
            )}
          />
          <Input
            theme="gray"
            label={t('stock.invoiceNumber')}
            error={!!errors.invoiceNumber}
            required
            {...register('invoiceNumber', { required: true })}
          />
          <Controller
            control={control}
            name="category"
            rules={{
              required: true,
              onChange () {
                setValue('size', '');
                clearErrors('size');
              },
            }}
            render={({ field, fieldState }) => (
              <AutocompleteTextField
                label={t('stock.category')}
                options={prevCategories}
                theme="gray"
                onChange={field.onChange}
                value={field.value}
                required
                error={!!fieldState.error}
                ref={field.ref}
              />
            )}
          />
          {watch('category') === 'Clothes' && (
            <Controller
              control={control}
              name="size"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <Select
                  label={t('stock.size')}
                  options={SIZES}
                  value={field.value}
                  onChange={(e) => void field.onChange(e.target.value)}
                  theme="gray"
                  error={!!fieldState.error}
                  required
                />
              )}
            />
          )}
          {watch('category') === 'Shoes' && (
            <Input
              label={t('stock.size')}
              theme="gray"
              error={!!errors.size}
              required
              type="number"
              {...register('size', { required: true })}
            />
          )}
          <Input
            type="number"
            required
            theme="gray"
            label={t('stock.count')}
            error={!!errors.count}
            {...register('count', { required: true })}
          />
          <Input
            type="number"
            theme="gray"
            label={t('stock.price')}
            InputProps={{ endAdornment: EuroEndAdornment }}
            required
            error={!!errors.price}
            {...register('price', { required: true })}
          />
          <Input
            type="number"
            theme="gray"
            label={t('stock.damageCompencationPrice')}
            InputProps={{ endAdornment: EuroEndAdornment }}
            required
            error={!!errors.damageCompencationPrice}
            {...register('damageCompencationPrice', { required: true })}
          />
          <Controller
            control={control}
            name="orderer"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <Select
                label={t('stock.orderer')}
                options={clients}
                value={field.value}
                onChange={(e) => void field.onChange(e.target.value)}
                theme="gray"
                labelPath="shortName"
                valuePath="_id"
                error={!!fieldState.error}
                required
              />
            )}
          />
          <Controller
            control={control}
            name="deliveryDate"
            render={({ field }) => (
              <DatePicker
                label={t('stock.deliveryDate')}
                inputProps={{ theme: 'gray' }}
                onChange={field.onChange}
                defaultValue={field.value}
              />
            )}
          />
          <Controller
            control={control}
            name="receiver"
            render={({ field }) => (
              <Select
                label={t('stock.receiver')}
                options={receivers}
                value={field.value}
                onChange={(e) => void field.onChange(e.target.value)}
                theme="gray"
                labelPath="fullname"
                valuePath="_id"
              />
            )}
          />
          <Controller
            control={control}
            name="location"
            render={({ field }) => (
              <AutocompleteTextField
                label={t('stock.location')}
                options={prevLocations}
                theme="gray"
                onChange={field.onChange}
                value={field.value}
              />
            )}
          />
          <Input
            theme="gray"
            label={t('stock.identification')}
            {...register('identification')}
          />
          <Input
            theme="gray"
            label={t('stock.comment')}
            {...register('comment')}
          />
        </div>
      </DialogContentWrapper>
      <DialogActions>
        <Button variant="contained" onClick={handleSubmit(submitHandler)}>{t('save')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(PropertyFormDialog);
