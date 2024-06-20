import React, { memo, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import isEmpty from 'lodash-es/isEmpty';
import isEqual from 'lodash-es/isEqual';
import { DateTime } from 'luxon';
import { Button, Checkbox } from 'v2/uikit';
import Autocomplete from 'v2/uikit/Autocomplete';
import DatePicker from 'v2/uikit/DatePicker';
import Dialog from 'v2/uikit/Dialog';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import { FormCard, FormCardBody, FormCardHeader } from 'v2/uikit/FormCard';
import IconButton from 'v2/uikit/IconButton';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from 'v2/uikit/Table';

import { AccommodationIcon, DeleteIcon, EditIcon, PlusIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import createId from 'helpers/createId';
import { getDateFromIso } from 'helpers/datetime';
import { isMongoId } from 'helpers/regex';
import useListState from 'hooks/useListState';
import { IAccommodation } from 'interfaces/accommodation.interface';
import { IResidence } from 'interfaces/residence.interface';

import { ActionsCell, FinanceDialogContent } from './styles';

type Props = {
  data: IResidence[];
  accommodations: IAccommodation[];
  onDeleteResidence?(id: string): void;
  onUpdateResidence?(data: Partial<IResidence>, notificateOwner?: boolean): void;
  onCreateResidence?(data: Partial<IResidence>, notificateOwner?: boolean): void;
};

const FinancesFormCard = ({ data, accommodations, onCreateResidence, onDeleteResidence, onUpdateResidence }: Props) => {
  const { t } = useTranslation();
  const { permissions } = useAuthData();

  const [residenceDialogData, setResidenceDialogData] = useState<Partial<IResidence> | null>(null);
  const [deleteDialogData, setDeleteDialogData] = useState<Partial<IResidence> | null>(null);

  const { control, formState: { errors }, getValues, reset, handleSubmit } = useForm<IResidence>();

  const [residences, { add, remove, update }, setResidences] = useListState(data);

  const [notificateOwner, setNotificateOwner] = useState<boolean>(false);

  const createResidenceHandler = () => {
    const values = getValues();
    onCreateResidence?.(values, notificateOwner);
    add({
      ...values,
      _id: createId(),
      createdAt: DateTime.now().toISO(),
      accommodation: accommodations.find((item) => item._id === values.accommodation) as IAccommodation,
    }, 'start');
  };

  const updateResidenceHandler = () => {
    if (residenceDialogData?._id) {
      const values = getValues();
      onUpdateResidence?.({ ...residenceDialogData, ...values }, notificateOwner);
      update(residenceDialogData as IResidence, values);
    }
  };

  const removeResidenceHandler = () => {
    if (deleteDialogData && deleteDialogData._id) {
      onDeleteResidence?.(deleteDialogData._id);
      remove(deleteDialogData as IResidence);
    }
  };

  const submitHandler: SubmitHandler<IResidence> = () => {
    if (isEmpty(errors) && residenceDialogData) {
      if (residenceDialogData._id) {
        updateResidenceHandler();
      } else {
        createResidenceHandler();
      }
      setResidenceDialogData(null);
    }
  };

  useEffect(() => {
    if (!isEqual(data, residences)) {
      setResidences(data);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setResidences]);

  return (
    <>
      <FormCard>
        <FormCardHeader icon={<AccommodationIcon size={24} />} title={t('accommodation.residences')}>
          {permissions.includes('residences:create') && (
            <Button onClick={() => { setResidenceDialogData({}); reset(); }}><PlusIcon />{t('add')}</Button>
          )}
        </FormCardHeader>
        <FormCardBody>
          {!!residences.length && (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('accommodation.name')}</TableCell>
                    <TableCell>{t('accommodation.adress')}</TableCell>
                    <TableCell>{t('accommodation.checkIn')}</TableCell>
                    <TableCell>{t('accommodation.checkOut')}</TableCell>
                    <TableCell>{t('accommodation.createdAt')}</TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {residences.map((residence) => (
                    <TableRow key={residence._id}>
                      <TableCell>{(residence.accommodation as IAccommodation).name}</TableCell>
                      <TableCell>{(residence.accommodation as IAccommodation).adress}</TableCell>
                      <TableCell>{getDateFromIso(residence.checkInDate)}</TableCell>
                      <TableCell>{getDateFromIso(residence.checkOutDate)}</TableCell>
                      <TableCell>{getDateFromIso(residence.createdAt, 'dd.MM.yyyy HH:mm')}</TableCell>
                      <TableCell>
                        <ActionsCell>
                          {permissions.includes('residences:update') && (
                            <IconButton disabled={!isMongoId(residence._id)} onClick={() => { setResidenceDialogData(residence); reset(residence); }}>
                              <EditIcon />
                            </IconButton>
                          )}
                          {permissions.includes('residences:delete') && (
                            <IconButton disabled={!isMongoId(residence._id)} onClick={() => void setDeleteDialogData(residence)}>
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </ActionsCell>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </FormCardBody>
      </FormCard>
      <Dialog
        mobileFullscreen
        title={t('accommodation.residence')}
        onClose={() => void setResidenceDialogData(null)}
        open={residenceDialogData !== null}
      >
        <FinanceDialogContent>
          <div className="form">
            <Controller
              control={control}
              name="accommodation"
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <Autocomplete
                  options={accommodations}
                  label={`${t('navbar.accommodation')}*`}
                  getOptionLabel={(option) => `${option.adress} (${option.owner})`}
                  defaultValue={residenceDialogData?.accommodation || null}
                  onChange={(v) => void field.onChange(v?._id || '')}
                  error={!!errors.accommodation}
                />
              )}
            />
            <Controller
              control={control}
              name="checkInDate"
              defaultValue={null}
              rules={{ required: true }}
              render={({ field }) => (
                <DatePicker
                  defaultValue={field.value}
                  onChange={field.onChange}
                  label={`${t('accommodation.checkIn')}*`}
                  error={!!errors.checkInDate}
                />
              )}
            />
            <Controller
              control={control}
              name="checkOutDate"
              defaultValue={null}
              render={({ field }) => (
                <DatePicker
                  defaultValue={field.value}
                  onChange={field.onChange}
                  label={t('accommodation.checkOut')}
                />
              )}
            />
          </div>
          <div className="actions">
            <Checkbox
              checked={notificateOwner}
              onChange={(e) => void setNotificateOwner(e.target.checked)}
              label={t('accommodation.notificate')}
            />
            <Button
              variant="contained"
              onClick={handleSubmit(submitHandler)}
            >
              {t('save')}
            </Button>
          </div>
        </FinanceDialogContent>
      </Dialog>
      <DialogConfirm
        open={deleteDialogData !== null}
        onSubmit={() => {
          removeResidenceHandler();
          setDeleteDialogData(null);
        }}
        onClose={() => void setDeleteDialogData(null)}
      />
    </>
  );
};

export default memo(FinancesFormCard);
