import React, { memo, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import isEmpty from 'lodash-es/isEmpty';
import isEqual from 'lodash-es/isEqual';
import { Button, Input } from 'v2/uikit';
import DatePicker from 'v2/uikit/DatePicker';
import Dialog, { DialogActions } from 'v2/uikit/Dialog';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import { FormCard, FormCardBody, FormCardHeader } from 'v2/uikit/FormCard';
import IconButton from 'v2/uikit/IconButton';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from 'v2/uikit/Table';

import { DeleteIcon, EditIcon, FactoryIcon, PlusIcon } from 'components/icons';
import { getDateFromIso } from 'helpers/datetime';
import useListState from 'hooks/useListState';
import { UserBusinessActivity } from 'interfaces/users.interface';

import { ActionsCell, ActivityDialogContent, DescriptionTableCell, ExpandTableWrapper } from './styles';

type Props = {
  data: UserBusinessActivity[];
  onUpdateActivities?(values: UserBusinessActivity[]): void;
};

const DaysOffFormCard = ({ data, onUpdateActivities }: Props) => {
  const { t } = useTranslation();

  const [activityDialogData, setActivityDialogData] = useState<Partial<UserBusinessActivity> | null>(null);
  const [deleteDialogData, setDeleteDialogData] = useState<Partial<UserBusinessActivity> | null>(null);

  const { register, control, formState: { errors }, getValues, reset, handleSubmit } = useForm<UserBusinessActivity>();

  const [activities, { add, remove, update }, setActivities] = useListState(data);

  const createActivityHandler = () => {
    const values = getValues();
    onUpdateActivities?.(add(values));
  };

  const updateActivityHandler = () => {
    const values = getValues();
    onUpdateActivities?.(update(activityDialogData as UserBusinessActivity, values));
  };

  const removeActivityHandler = () => {
    if (deleteDialogData !== null) {
      onUpdateActivities?.(remove(deleteDialogData as UserBusinessActivity));
    }
  };

  const submitHandler: SubmitHandler<UserBusinessActivity> = () => {
    if (isEmpty(errors) && activityDialogData !== null) {
      if (!isEmpty(activityDialogData)) {
        updateActivityHandler();
      } else {
        createActivityHandler();
      }
      setActivityDialogData(null);
    }
  };

  useEffect(() => {
    if (!isEqual(data, activities)) {
      setActivities(data);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setActivities]);

  return (
    <>
      <FormCard defaultConfig={{ disabled: true, showAll: false }}>
        {({ formCardConfig, updateFormCardConfig }) => (
          <>
            <FormCardHeader icon={<FactoryIcon size={24} />} title={t('user.businessActivities')}>
              <Button onClick={() => { setActivityDialogData({}); reset({}); }}><PlusIcon />{t('add')}</Button>
            </FormCardHeader>
            <FormCardBody>
              {!!activities.length && (
                <>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('businessActivity.description')}</TableCell>
                          <TableCell>{t('date')}</TableCell>
                          <TableCell align="right" />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(formCardConfig.showAll ? activities : activities.slice(0, 3)).map((activity) => (
                          <TableRow key={activity.description}>
                            <DescriptionTableCell>{activity.description}</DescriptionTableCell>
                            <TableCell>{getDateFromIso(activity.dateFrom)} {activity.dateTo ? `- ${getDateFromIso(activity.dateTo)}` : ''}</TableCell>
                            <TableCell align="right">
                              <ActionsCell>
                                <IconButton onClick={() => { setActivityDialogData(activity); reset(activity); }}>
                                  <EditIcon size={15} />
                                </IconButton>
                                <IconButton onClick={() => void setDeleteDialogData(activity)}>
                                  <DeleteIcon size={15} />
                                </IconButton>
                              </ActionsCell>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {activities.length > 3 && (
                    <ExpandTableWrapper>
                      <Button
                        onClick={() => updateFormCardConfig({ showAll: !formCardConfig.showAll })}
                      >
                        {!formCardConfig.showAll ? t('showAll') : t('rollup')}
                      </Button>
                    </ExpandTableWrapper>
                  )}
                </>
              )}
            </FormCardBody>
          </>
        )}
      </FormCard>
      <Dialog
        mobileFullscreen
        title={t('businessActivity.activity')}
        onClose={() => void setActivityDialogData(null)}
        open={activityDialogData !== null}>
        <ActivityDialogContent>
          <div className="form">
            <Input
              label={`${t('businessActivity.description')}*`}
              defaultValue={activityDialogData?.description || ''}
              multiline
              error={!!errors.description}
              {...register('description', { required: true })}
            />
            <Controller
              control={control}
              name="dateFrom"
              defaultValue={activityDialogData?.dateFrom || ''}
              rules={{ required: true }}
              render={({ field }) => (
                <DatePicker
                  defaultValue={field.value}
                  onChange={field.onChange}
                  label={`${t('businessActivity.dateFrom')}*`}
                  error={!!errors.dateFrom}
                />
              )}
            />
            <Controller
              control={control}
              name="dateTo"
              defaultValue={activityDialogData?.dateTo || ''}
              render={({ field }) => (
                <DatePicker
                  defaultValue={field.value}
                  onChange={field.onChange}
                  label={t('businessActivity.dateTo')}
                />
              )}
            />
          </div>
          <DialogActions>
            <Button
              variant="contained"
              onClick={handleSubmit(submitHandler)}
            >
              {t('save')}
            </Button>
          </DialogActions>
        </ActivityDialogContent>
      </Dialog>
      <DialogConfirm
        open={deleteDialogData !== null}
        onSubmit={() => {
          removeActivityHandler();
          setDeleteDialogData(null);
        }}
        onClose={() => void setDeleteDialogData(null)}
      />
    </>
  );
};

export default memo(DaysOffFormCard);
