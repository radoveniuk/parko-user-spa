import React, { memo, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import isEmpty from 'lodash-es/isEmpty';
import isEqual from 'lodash-es/isEqual';
import { DateTime } from 'luxon';
import { Button, Input } from 'v2/uikit';
import DatePicker from 'v2/uikit/DatePicker';
import Dialog from 'v2/uikit/Dialog';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import { FormCard, FormCardBody, FormCardHeader } from 'v2/uikit/FormCard';
import IconButton from 'v2/uikit/IconButton';
import { EuroEndAdornment } from 'v2/uikit/Input';
import Select from 'v2/uikit/Select';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from 'v2/uikit/Table';

import { DeleteIcon, EditIcon, PlusIcon, PrepaymentIcon } from 'components/icons';
import { PREPAYMENT_STATUS } from 'constants/selectsOptions';
import { useAuthData } from 'contexts/AuthContext';
import createId from 'helpers/createId';
import { getDateFromIso } from 'helpers/datetime';
import { isMongoId } from 'helpers/regex';
import useListState from 'hooks/useListState';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IPrepayment } from 'interfaces/prepayment.interface';

import { ActionsCell, PrepaymentDialogContent } from './styles';

type Props = {
  data: IPrepayment[];
  onDeletePrepayment?(id: string): void;
  onUpdatePrepayment?(data: Partial<IPrepayment>): void;
  onCreatePrepayment?(data: Partial<IPrepayment>): void;
};

const PrepaymentsFormCard = ({ data, onCreatePrepayment, onDeletePrepayment, onUpdatePrepayment }: Props) => {
  const { t } = useTranslation();
  const { permissions } = useAuthData();

  const [prepaymentDialogData, setPrepaymentDialogData] = useState<Partial<IPrepayment> | null>(null);
  const [deleteDialogData, setDeleteDialogData] = useState<Partial<IPrepayment> | null>(null);
  const prepaymentStatusList = useTranslatedSelect(PREPAYMENT_STATUS, 'prepaymentStatus', true, false);

  const { register, control, formState: { errors }, getValues, reset, handleSubmit, clearErrors } = useForm<IPrepayment>();

  const prepaymentStatus = useWatch({ control, name: 'status' });

  const [prepayments, { add, remove, update }, setPrepayments] = useListState(data);

  const createPrepaymentHandler = () => {
    const values = getValues();
    onCreatePrepayment?.(values);
    add({ ...values, _id: createId(), createdAt: DateTime.now().toISO() }, 'start');
  };

  const updatePrepaymentHandler = () => {
    if (prepaymentDialogData?._id) {
      const values = getValues();
      onUpdatePrepayment?.({ ...prepaymentDialogData, ...values });
      update(prepaymentDialogData as IPrepayment, values);
    }
  };

  const removePrepaymentHandler = () => {
    if (deleteDialogData && deleteDialogData._id) {
      onDeletePrepayment?.(deleteDialogData._id);
      remove(deleteDialogData as IPrepayment);
    }
  };

  const submitHandler: SubmitHandler<IPrepayment> = () => {
    if (isEmpty(errors) && prepaymentDialogData) {
      if (prepaymentDialogData._id) {
        updatePrepaymentHandler();
      } else {
        createPrepaymentHandler();
      }
      setPrepaymentDialogData(null);
    }
  };

  useEffect(() => {
    if (!isEqual(data, prepayments)) {
      setPrepayments(data);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setPrepayments]);

  return (
    <>
      <FormCard>
        <FormCardHeader icon={<PrepaymentIcon size={24} />} title={t('navbar.prepayments')}>
          {permissions.includes('prepayments:create') && (
            <Button onClick={() => { setPrepaymentDialogData({}); reset({}); }}><PlusIcon />{t('add')}</Button>
          )}
        </FormCardHeader>
        <FormCardBody>
          {!!prepayments.length && (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('prepayment.period')}</TableCell>
                    <TableCell>{t('prepayment.sum')}</TableCell>
                    <TableCell>{t('prepayment.comment')}</TableCell>
                    <TableCell>{t('prepayment.status')}</TableCell>
                    <TableCell>{t('prepayment.paymentDate')}</TableCell>
                    <TableCell>{t('prepayment.createdAt')}</TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prepayments.map((prepayment) => (
                    <TableRow key={prepayment._id}>
                      <TableCell>{getDateFromIso(prepayment.period, 'MM/yyyy')}</TableCell>
                      <TableCell>{prepayment.sum}€</TableCell>
                      <TableCell>{prepayment.adminComment}</TableCell>
                      <TableCell>{t(`selects.prepaymentStatus.${prepayment.status}`)}</TableCell>
                      <TableCell>{getDateFromIso(prepayment.paymentDate)}</TableCell>
                      <TableCell>{getDateFromIso(prepayment.createdAt, 'dd.MM.yyyy HH:mm')}</TableCell>
                      <TableCell align="right">
                        <ActionsCell>
                          {permissions.includes('prepayments:update') && (
                            <IconButton
                              disabled={!isMongoId(prepayment._id)}
                              onClick={() => { setPrepaymentDialogData(prepayment); reset(prepayment); }}
                            >
                              <EditIcon />
                            </IconButton>
                          )}
                          {permissions.includes('prepayments:delete') && (
                            <IconButton disabled={!isMongoId(prepayment._id)} onClick={() => void setDeleteDialogData(prepayment)}>
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
        title={t('prepayment.prepayment')}
        onClose={() => { setPrepaymentDialogData(null); reset(); }}
        open={prepaymentDialogData !== null}
      >
        <PrepaymentDialogContent>
          <div className="form">
            {permissions.includes('prepayments:updatePeriod') && (
              <Controller
                control={control}
                name="period"
                defaultValue={prepaymentDialogData?.period || undefined}
                rules={{ required: true }}
                render={({ field }) => (
                  <DatePicker
                    views={['year', 'month']}
                    format="MM/yyyy"
                    openTo="month"
                    defaultValue={field.value}
                    onChange={field.onChange}
                    label={`${t('prepayment.period')}*`}
                    error={!!errors.period}
                    inputProps={{ theme: 'gray' }}
                  />
                )}
              />
            )}
            <Input
              InputProps={{ endAdornment: EuroEndAdornment }}
              label={t('prepayment.sum')}
              defaultValue={prepaymentDialogData?.sum || ''}
              type="number"
              error={!!errors.sum}
              theme="gray"
              {...register('sum', { required: true })}
              required
            />
            <Select
              theme="gray"
              label={t('prepayment.status')}
              error={!!errors.status}
              options={prepaymentStatusList}
              defaultValue={prepaymentDialogData?.status || 'pending'}
              {...register('status', {
                onChange (v) {
                  if (v.target.value !== 'rejected') {
                    clearErrors(['adminComment']);
                  }
                },
              })}
            />
            <Controller
              control={control}
              name="paymentDate"
              defaultValue={prepaymentDialogData?.paymentDate || null}
              render={({ field }) => (
                <DatePicker
                  defaultValue={field.value}
                  onChange={field.onChange}
                  label={t('prepayment.paymentDate')}
                  inputProps={{ theme: 'gray' }}
                  views={['day']}
                />
              )}
            />
            <Input
              label={`${t('prepayment.comment')}${prepaymentStatus === 'rejected' ? '*' : ''}`}
              defaultValue={prepaymentDialogData?.adminComment || ''}
              theme="gray"
              error={!!errors.adminComment}
              {...register('adminComment', { required: prepaymentStatus === 'rejected' })}
            />
          </div>
          <div className="actions">
            <Button
              variant="contained"
              onClick={handleSubmit(submitHandler)}
            >
              {t('save')}
            </Button>
          </div>
        </PrepaymentDialogContent>
      </Dialog>
      <DialogConfirm
        open={deleteDialogData !== null}
        onSubmit={() => {
          removePrepaymentHandler();
          setDeleteDialogData(null);
        }}
        onClose={() => void setDeleteDialogData(null)}
      />
    </>
  );
};

export default memo(PrepaymentsFormCard);
