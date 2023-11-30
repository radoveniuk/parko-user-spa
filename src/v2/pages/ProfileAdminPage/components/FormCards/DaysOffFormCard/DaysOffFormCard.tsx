import React, { memo, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
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
import Select from 'v2/uikit/Select';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from 'v2/uikit/Table';

import { DayoffIcon, DeleteIcon, EditIcon, PlusIcon } from 'components/icons';
import { REASONS } from 'constants/dayoffReasons';
import createId from 'helpers/createId';
import { getDateFromIso } from 'helpers/datetime';
import { isMongoId } from 'helpers/regex';
import useListState from 'hooks/useListState';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { IDayOff } from 'interfaces/dayoff.interface';

import { ActionsCell, DayOffDialogContent } from './styles';

type Props = {
  data: IDayOff[];
  onDeleteDayoff?(id: string): void;
  onUpdateDayoff?(data: Partial<IDayOff>): void;
  onCreateDayoff?(data: Partial<IDayOff>): void;
};

const DaysOffFormCard = ({ data, onCreateDayoff, onDeleteDayoff, onUpdateDayoff }: Props) => {
  const { t } = useTranslation();

  const [dayoffDialogData, setDayoffDialogData] = useState<Partial<IDayOff> | null>(null);
  const [deleteDialogData, setDeleteDialogData] = useState<Partial<IDayOff> | null>(null);
  const reasonsList = useTranslatedSelect(REASONS, 'dayoffReason');

  const { register, control, formState: { errors }, getValues, reset, handleSubmit } = useForm<IDayOff>();

  const [daysoff, { add, remove, update }, setDaysoff] = useListState(data);

  const createDayoffHandler = () => {
    const values = getValues();
    onCreateDayoff?.(values);
    add({ ...values, _id: createId(), createdAt: DateTime.now().toISO() });
  };

  const updateDayoffHandler = () => {
    if (dayoffDialogData?._id) {
      const values = getValues();
      onUpdateDayoff?.({ ...dayoffDialogData, ...values });
      update(dayoffDialogData as IDayOff, values);
    }
  };

  const removeDayoffHandler = () => {
    if (deleteDialogData && deleteDialogData._id) {
      onDeleteDayoff?.(deleteDialogData._id);
      remove(deleteDialogData as IDayOff);
    }
  };

  const submitHandler: SubmitHandler<IDayOff> = () => {
    if (isEmpty(errors) && dayoffDialogData) {
      if (dayoffDialogData._id) {
        updateDayoffHandler();
      } else {
        createDayoffHandler();
      }
      setDayoffDialogData(null);
    }
  };

  useEffect(() => {
    if (!isEqual(data, daysoff)) {
      setDaysoff(data);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setDaysoff]);

  return (
    <>
      <FormCard>
        <FormCardHeader icon={<DayoffIcon size={24} />} title={t('navbar.daysoff')}>
          <Button onClick={() => { setDayoffDialogData({}); reset(); }}><PlusIcon />{t('add')}</Button>
        </FormCardHeader>
        <FormCardBody>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('dayoff.reason')}</TableCell>
                  <TableCell>{t('dayoff.dateStart')}</TableCell>
                  <TableCell>{t('dayoff.dateEnd')}</TableCell>
                  <TableCell>{t('dayoff.createdAt')}</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {daysoff.map((dayoff) => (
                  <TableRow key={dayoff._id}>
                    <TableCell>{t(`selects.dayoffReason.${dayoff.reason}`)}</TableCell>
                    <TableCell>{getDateFromIso(dayoff.dateStart)}</TableCell>
                    <TableCell>{getDateFromIso(dayoff.dateEnd)}</TableCell>
                    <TableCell>{getDateFromIso(dayoff.createdAt, 'dd.MM.yyyy HH:mm')}</TableCell>
                    <TableCell align="right">
                      <ActionsCell>
                        <IconButton disabled={!isMongoId(dayoff._id)} onClick={() => { setDayoffDialogData(dayoff); reset(dayoff); }}>
                          <EditIcon size={15} />
                        </IconButton>
                        <IconButton disabled={!isMongoId(dayoff._id)} onClick={() => void setDeleteDialogData(dayoff)}>
                          <DeleteIcon size={15} />
                        </IconButton>
                      </ActionsCell>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </FormCardBody>
      </FormCard>
      <Dialog mobileFullscreen title={t('dayoff.dayoff')} onClose={() => void setDayoffDialogData(null)} open={dayoffDialogData !== null}>
        <DayOffDialogContent>
          <div className="form">
            <Controller
              control={control}
              name="dateStart"
              defaultValue={dayoffDialogData?.dateStart || ''}
              rules={{ required: true }}
              render={({ field }) => (
                <DatePicker
                  defaultValue={field.value}
                  onChange={field.onChange}
                  label={`${t('dayoff.dateStart')}*`}
                  error={!!errors.dateStart}
                />
              )}
            />
            <Controller
              control={control}
              name="dateEnd"
              defaultValue={dayoffDialogData?.dateEnd || ''}
              rules={{ required: true }}
              render={({ field }) => (
                <DatePicker
                  defaultValue={field.value}
                  onChange={field.onChange}
                  label={`${t('dayoff.dateEnd')}*`}
                  error={!!errors.dateEnd}
                />
              )}
            />
            <Select
              label={`${t('dayoff.reason')}*`}
              error={!!errors.reason}
              options={reasonsList}
              defaultValue={dayoffDialogData?.reason || ''}
              {...register('reason', { required: true })}
            />
            <Input
              label={t('dayoff.adminComment')}
              defaultValue={dayoffDialogData?.adminComment || ''}
              multiline
              {...register('adminComment')}
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
        </DayOffDialogContent>
      </Dialog>
      <DialogConfirm
        open={deleteDialogData !== null}
        onSubmit={() => {
          removeDayoffHandler();
          setDeleteDialogData(null);
        }}
        onClose={() => void setDeleteDialogData(null)}
      />
    </>
  );
};

export default memo(DaysOffFormCard);
