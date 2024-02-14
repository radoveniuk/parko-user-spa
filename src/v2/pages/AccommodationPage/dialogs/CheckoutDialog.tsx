import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import Autocomplete from 'v2/uikit/Autocomplete';
import Button from 'v2/uikit/Button';
import Checkbox from 'v2/uikit/Checkbox';
import DatePicker from 'v2/uikit/DatePicker';
import Dialog, { DialogProps } from 'v2/uikit/Dialog';

import { useUpdateResidence } from 'api/mutations/residenceMutation';
import { useGetResidences } from 'api/query/residenceQuery';
import { IResidence } from 'interfaces/residence.interface';
import { IUser } from 'interfaces/users.interface';

import { DialogContentWrapper } from './styles';

const CheckoutDialog = ({ onClose, ...rest }: DialogProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [selectedResidence, setSelectedResidence] = useState<IResidence | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<string>('');
  const [notificateOwner, setNotificateOwner] = useState<boolean>(true);
  const updateResidence = useUpdateResidence();

  const { data: residences = [] } = useGetResidences({ active: true });

  const submitHandler = () => {
    if (!selectedResidence || !checkOutDate) return;

    updateResidence
      .mutateAsync({ data: { ...selectedResidence, checkOutDate }, notificate: notificateOwner })
      .then(() => {
        queryClient.refetchQueries(['residences']);
        onClose();
      });
  };

  return (
    <Dialog
      mobileFullscreen
      title={`Check out${selectedResidence ? ` (${(selectedResidence.user as IUser).name} ${(selectedResidence.user as IUser).surname})` : ''}`}
      onClose={onClose}
      {...rest}
    >
      <DialogContentWrapper>
        <div className="form">
          <Autocomplete
            theme="gray"
            options={residences}
            label={`${t('search')}*`}
            getOptionLabel={(option) => `${option.user.name} ${option.user.surname} (${option.accommodation.adress})`}
            style={{ minWidth: 223 }}
            onChange={setSelectedResidence}
          />
          <DatePicker
            defaultValue={checkOutDate}
            onChange={setCheckOutDate}
            label={`${t('accommodation.checkOut')}*`}
            inputProps={{ theme: 'gray' }}
          />
        </div>
        <div className="actions">
          <Checkbox
            checked={notificateOwner}
            onChange={(e) => void setNotificateOwner(e.target.checked)}
            label={t('accommodation.notificate')}
          />
          <Button variant="contained" onClick={submitHandler} disabled={!selectedResidence || !checkOutDate}>{t('approve')}</Button>
        </div>
      </DialogContentWrapper>
    </Dialog>
  );
};

export default CheckoutDialog;
