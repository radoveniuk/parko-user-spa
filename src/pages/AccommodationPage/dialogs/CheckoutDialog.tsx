import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useUpdateResidence } from 'api/mutations/residenceMutation';
import Button from 'components/shared/Button';
import Checkbox from 'components/shared/Checkbox';
import DatePicker from 'components/shared/DatePicker';
import Dialog, { DialogProps } from 'components/shared/Dialog';
import Search from 'components/shared/Search';
import { IAccommodation } from 'interfaces/accommodation.interface';
import { IResidence } from 'interfaces/residence.interface';
import { IUser } from 'interfaces/users.interface';

import { DialogContentWrapper } from './styles';

const CheckoutDialog = ({ onClose, ...rest }: DialogProps) => {
  const { t } = useTranslation();

  const [selectedResidence, setSelectedResidence] = useState<IResidence | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<string>('');
  const [notificateOwner, setNotificateOwner] = useState<boolean>(true);
  const updateResidence = useUpdateResidence();

  const submitHandler = () => {
    if (!selectedResidence || !checkOutDate) return;

    updateResidence.mutateAsync({ data: { ...selectedResidence, checkOutDate }, notificate: notificateOwner }).then(() => { onClose(); });
  };

  return (
    <Dialog
      title={`Check out${selectedResidence ? ` (${(selectedResidence.user as IUser).name} ${(selectedResidence.user as IUser).surname})` : ''}`}
      onClose={onClose}
      {...rest}
    >
      <DialogContentWrapper>
        <div className="form">
          <Search<IResidence>
            url="/residences?checkOutDate="
            onSelectItem={setSelectedResidence}
            searchItemComponent={(item) => {
              const { name, surname } = item.user as IUser;
              const { adress } = item.accommodation as IAccommodation;
              return `${name} ${surname} (${adress})`;
            }}
          />
          <DatePicker value={checkOutDate} onChange={setCheckOutDate} label={t('accommodation.checkOut')} />
        </div>
        <div className="actions">
          <Checkbox
            checked={notificateOwner}
            onChange={(e) => void setNotificateOwner(e.target.checked)}
            title={t('accommodation.notificate')}
          />
          <Button onClick={submitHandler} disabled={!selectedResidence || !checkOutDate}>{t('OK')}</Button>
        </div>
      </DialogContentWrapper>
    </Dialog>
  );
};

export default CheckoutDialog;
