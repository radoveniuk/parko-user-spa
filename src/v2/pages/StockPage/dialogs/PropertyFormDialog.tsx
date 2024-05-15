import React, { memo, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Input } from 'v2/uikit';
import AutocompleteTextField from 'v2/uikit/AutocompleteTextField';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';

import { useGetProperties } from 'api/query/propertyQuery';
import { IProperty } from 'interfaces/property.interface';

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
      updatedBy: data.updatedBy._id,
    };
    return result;
  };

  const { t } = useTranslation();

  const { register, control, formState: { errors }, watch } = useForm<IProperty>({ defaultValues: defaultData ? prepareDefaultData(defaultData) : {} });
  console.log(watch());

  const { data: prevProperties = [] } = useGetProperties();
  const prevInternalNames = useMemo(() => prevProperties.map(item => item.internalName), [prevProperties]);
  const prevTradeNames = useMemo(() => prevProperties.map(item => item.tradeName), [prevProperties]);
  const prevDistributors = useMemo(() => prevProperties.map(item => item.distributorICO), [prevProperties]);

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
            render={({ field }) => (
              <AutocompleteTextField
                label={t('stock.internalName')}
                options={prevInternalNames}
                theme="gray"
                required
                onChange={field.onChange}
                value={field.value}
              />
            )}
          />
          <AutocompleteTextField
            label={t('stock.tradeName')}
            options={prevTradeNames}
            theme="gray"
            required
            {...register('tradeName', { required: true })}
          />
          <AutocompleteTextField
            label={t('stock.distributorICO')}
            options={prevDistributors}
            theme="gray"
            required
            {...register('distributorICO', { required: true })}
          />
        </div>
      </DialogContentWrapper>
      <DialogActions>
        <Button variant="contained">{t('save')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(PropertyFormDialog);
