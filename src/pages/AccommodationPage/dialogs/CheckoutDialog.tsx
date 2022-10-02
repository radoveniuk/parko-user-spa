import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';

import { useUpdateResidence } from 'api/mutations/residenceMutation';
import { useGetResidences } from 'api/query/residenceQuery';
import Autocomplete from 'components/shared/Autocomplete';
import Button from 'components/shared/Button';
import Checkbox from 'components/shared/Checkbox';
import DatePicker from 'components/shared/DatePicker';
import Dialog, { DialogProps } from 'components/shared/Dialog';
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
      title={`Check out${selectedResidence ? ` (${(selectedResidence.user as IUser).name} ${(selectedResidence.user as IUser).surname})` : ''}`}
      onClose={onClose}
      {...rest}
    >
      <DialogContentWrapper>
        <div className="form">
          <Autocomplete
            options={residences}
            label={t('search')}
            getOptionLabel={(option) => `${option.user.name} ${option.user.surname} (${option.accommodation.adress})`}
            style={{ minWidth: 223 }}
            onChange={setSelectedResidence}
          />
          <DatePicker value={checkOutDate} onChange={setCheckOutDate} label={t('accommodation.checkOut')} />
        </div>
        <div className="actions">
          <Checkbox
            checked={notificateOwner}
            onChange={(e) => void setNotificateOwner(e.target.checked)}
            title={t('accommodation.notificate')}
          />
          <Button onClick={submitHandler} disabled={!selectedResidence || !checkOutDate}>{t('approve')}</Button>
        </div>
      </DialogContentWrapper>
    </Dialog>
  );
};

export default CheckoutDialog;
