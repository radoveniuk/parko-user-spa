import React, { memo, useEffect, useMemo } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Input } from 'v2/uikit';
import AutoComplete from 'v2/uikit/Autocomplete';
import DatePicker from 'v2/uikit/DatePicker';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';
import Select from 'v2/uikit/Select';

import { useGetProperties } from 'api/query/propertyQuery';
import { useGetUserListForFilter } from 'api/query/userQuery';
import { IPropertyMovement, PropertyMovementType } from 'interfaces/propertyMovement.interface';

// import usePropertyActions from '../Properties/hooks/usePropertyActions';
import { DialogContentWrapper } from './styles';

type Props = DialogProps & {
  defaultData?: IPropertyMovement<true>;
  type: PropertyMovementType;
};

const MovementFormDialog = ({ defaultData, onClose, type, ...rest }: Props) => {
  const prepareDefaultData = (data: IPropertyMovement<true>): IPropertyMovement => {
    const result: IPropertyMovement = {
      ...data,
      user: data.user._id,
      project: data.project._id,
      client: data.client._id,
      contractor: data.contractor._id,
      property: data.property._id,
      recorder: data.recorder._id,
      createdBy: data.createdBy._id,
      updatedBy: data.updatedBy._id,
    };
    return result;
  };

  const { t } = useTranslation();

  const { register, control, formState: { errors }, handleSubmit, watch, setValue } =
  useForm<IPropertyMovement>({ defaultValues: defaultData ? prepareDefaultData(defaultData) : { type } });

  const { data: users = [], isFetching: isFetchingUsers } = useGetUserListForFilter({}, { enabled: type === 'give' });
  const { data: recorders } = useGetUserListForFilter({ isInternal: true });
  const { data: properties = [], isFetching: isFetchingProperties } = useGetProperties();

  // const { create, update } = usePropertyActions();

  const submitHandler: SubmitHandler<IPropertyMovement> = (data) => {
    // if (defaultData) {
    //   update(data);
    // } else {
    //   create(data);
    // }
    onClose();
  };

  const selectedPropertyId = watch('property');
  const selectedProperty = useMemo(() => properties.find(property => property._id === selectedPropertyId), [properties, selectedPropertyId]);

  useEffect(() => {
    if (selectedProperty) {
      setValue('damageCompencationPrice', selectedProperty?.damageCompencationPrice);
    }
  }, [selectedProperty, setValue]);

  const translatedType = t(`selects.propertyMovementType.${type}`);

  return (
    <Dialog
      mobileFullscreen
      title={defaultData ? `${defaultData?.property.internalName} ${translatedType}` : translatedType}
      onClose={onClose}
      {...rest}
    >
      <DialogContentWrapper>
        <div className="form">
          {type === 'give' && (
            <Controller
              control={control}
              name="user"
              render={({ field }) => (
                <AutoComplete
                  label={t('stock.user')}
                  options={users}
                  value={users.find(item => item._id === field.value)}
                  onChange={(v) => void field.onChange(v?._id)}
                  theme="gray"
                  getOptionLabel={row => `${row.fullname}${row.project ? `, ${row.project.client.shortName} > ${row.project.name}` : ''}`}
                  valueKey="_id"
                  disabled={isFetchingUsers}
                />
              )}
            />
          )}
          <Controller
            control={control}
            name="property"
            render={({ field }) => (
              <AutoComplete
                label={t('stock.property')}
                options={properties}
                value={properties.find(item => item._id === field.value)}
                onChange={(v) => void field.onChange(v?._id)}
                theme="gray"
                getOptionLabel={row => `${row.internalName} (${row.count})`}
                valueKey="_id"
                disabled={isFetchingProperties}
              />
            )}
          />
          {!!selectedProperty && type === 'give' && (
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
          <Input
            label={t('stock.count')}
            theme="gray"
            type="number"
            {...register('count')}
          />
          {type === 'writeoff' && (
            <>
              <Controller
                control={control}
                name="writeoffReason"
                render={({ field }) => (
                  <Select
                    label={t('stock.writeoffReason')}
                    options={[]}
                    value={field.value}
                    onChange={(e) => void field.onChange(e.target.value)}
                    theme="gray"
                    // labelPath="fullname"
                    // valuePath="_id"
                  />
                )}
              />
              <Controller
                control={control}
                name="damageCompencationPrice"
                render={({ field }) => (
                  <Input
                    label={t('stock.damageCompencationPrice')}
                    value={field.value}
                    type="number"
                    onChange={(e) => void field.onChange(e.target.value)}
                    theme="gray"
                    InputProps={{ endAdornment: <div style={{ width: 24 }}>€</div> }}
                  />
                )}
              />
            </>
          )}
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <DatePicker
                label={t('stock.date')}
                inputProps={{ theme: 'gray' }}
                onChange={field.onChange}
                defaultValue={field.value}
              />
            )}
          />
          <Controller
            control={control}
            name="recorder"
            render={({ field }) => (
              <Select
                label={t('stock.recorder')}
                options={recorders}
                value={field.value}
                onChange={(e) => void field.onChange(e.target.value)}
                theme="gray"
                labelPath="fullname"
                valuePath="_id"
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

export default memo(MovementFormDialog);
