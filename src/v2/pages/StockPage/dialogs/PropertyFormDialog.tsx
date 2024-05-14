import React, { memo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from 'v2/uikit';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';

import { IProperty } from 'interfaces/property.interface';

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

  const { register, control, formState: { errors } } = useForm<IProperty>({ defaultValues: defaultData ? prepareDefaultData(defaultData) : {} });

  return (
    <Dialog
      mobileFullscreen
      title={defaultData?.internalName || t('stock.property')}
      onClose={onClose}
      {...rest}
    >
      <div className="form">

      </div>
      <DialogActions>
        <Button variant="contained">{t('save')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(PropertyFormDialog);
