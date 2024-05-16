import React, { memo, useMemo } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Input } from 'v2/uikit';
import AutocompleteTextField from 'v2/uikit/AutocompleteTextField';
import DatePicker from 'v2/uikit/DatePicker';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';
import Select from 'v2/uikit/Select';

import { useGetClients } from 'api/query/clientQuery';
import { useGetProperties } from 'api/query/propertyQuery';
import { useGetUserListForFilter } from 'api/query/userQuery';
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
      createdBy: data.createdBy._id,
      updatedBy: data.updatedBy?._id,
    };
    return result as IProperty;
  };

  const { t } = useTranslation();

  const { register, control, formState: { errors }, handleSubmit } =
  useForm<IProperty>({ defaultValues: defaultData ? prepareDefaultData(defaultData) : {} });

  const { data: prevProperties = [] } = useGetProperties();
  const prevInternalNames = useMemo(() => Array.from(new Set(prevProperties.map(item => item.internalName))), [prevProperties]);
  const prevTradeNames = useMemo(() => Array.from(new Set(prevProperties.map(item => item.tradeName))), [prevProperties]);
  const prevDistributors = useMemo(() => Array.from(new Set(prevProperties.map(item => item.distributorICO))), [prevProperties]);
  const prevLocations = useMemo(() => Array.from(new Set(prevProperties.map(item => item.location))), [prevProperties]);

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
          {/* <Controller
            control={control}
            name="type"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <Select
                label={t('stock.type')}
                options={[]}
                value={field.value}
                onChange={(e) => void field.onChange(e.target.value)}
                theme="gray"
                error={!!fieldState.error}
                required
              />
            )}
          /> */}
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
            InputProps={{ endAdornment: <div style={{ width: 24 }}>€</div> }}
            required
            error={!!errors.price}
            {...register('price', { required: true })}
          />
          <Input
            type="number"
            theme="gray"
            label={t('stock.damageCompencationPrice')}
            InputProps={{ endAdornment: <div style={{ width: 24 }}>€</div> }}
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
        </div>
      </DialogContentWrapper>
      <DialogActions>
        <Button variant="contained" onClick={handleSubmit(submitHandler)}>{t('save')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(PropertyFormDialog);
