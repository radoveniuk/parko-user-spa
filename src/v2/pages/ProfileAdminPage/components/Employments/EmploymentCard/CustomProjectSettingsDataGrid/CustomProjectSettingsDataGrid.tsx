import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import { Button, Input } from 'v2/uikit';
import DatePicker from 'v2/uikit/DatePicker';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';
import Select from 'v2/uikit/Select';

import { DeleteIcon, PlusIcon } from 'components/icons';
import { EMPLOYMENT_TYPE } from 'constants/selectsOptions';
import { useAuthData } from 'contexts/AuthContext';
import createId from 'helpers/createId';
import { getDateFromIso } from 'helpers/datetime';
import useListState from 'hooks/useListState';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { ProjectPositionChange } from 'interfaces/employment.interface';
import { ProjectPosition } from 'interfaces/project.interface';

import { CustomProjectSettingsDataGridWrapper } from './styles';

type CustomProjectSettingsDataGridRowProps = {
  data: ProjectPositionChange;
  onChange(data: ProjectPositionChange): void;
  onDelete(): void;
  disabledForRecruiter: boolean;
  triggerAllFields: boolean;
};

const CustomProjectSettingsDataGridRow = ({
  data, onChange, onDelete, disabledForRecruiter, triggerAllFields,
}: CustomProjectSettingsDataGridRowProps) => {
  const { role } = useAuthData();
  const disabled = role !== 'admin' && disabledForRecruiter;
  const { register, watch, control, setValue, trigger, formState: { errors }, clearErrors } = useForm<typeof data>({ defaultValues: data });

  const { t } = useTranslation();

  const employmentTypeOptions = useTranslatedSelect(EMPLOYMENT_TYPE, 'employmentType');

  const dataFieldProps = {
    theme: 'gray',
    className: 'border-right',
    disabled,
    error: !!errors.data,
    ...register('data', { required: true, onChange () { clearErrors('data'); } }),
  } as const;

  const SETTINGS_FIELDS_MAP: Partial<Record<keyof ProjectPosition, { field: ReactNode, label: string }>> = {
    address: {
      field: (
        <Input
          label={t('user.employmentChangeData')}
          {...dataFieldProps}
        />
      ),
      label: 'Miesto výkonu práce',
    },
    internalName: {
      field: (
        <Input
          label={t('user.employmentChangeData')}
          {...dataFieldProps}
        />
      ),
      label: 'Interný názov',
    },
    ISCO: {
      field: (
        <Input
          type="number"
          label={t('user.employmentChangeData')}
          {...dataFieldProps}
        />
      ),
      label: 'ISCO',
    },
    name: {
      field: (
        <Input
          label={t('user.employmentChangeData')}
          {...dataFieldProps}
        />
      ),
      label: 'Názov',
    },
    employmentType: {
      field: (
        <Select
          defaultValue={data.data}
          label={t('user.employmentChangeData')}
          options={employmentTypeOptions}
          {...dataFieldProps}
        />
      ),
      label: t('user.employmentType'),
    },
    variability: {
      field: (
        <Input
          type="number"
          label={t('user.employmentChangeData')}
          {...dataFieldProps}
        />
      ),
      label: 'Zmennosť',
    },
    salary: {
      field: (
        <Input
          label={t('user.employmentChangeData')}
          {...dataFieldProps}
        />
      ),
      label: 'Mzda',
    },
    salaryType: {
      field: (
        <Select
          options={['mes.', 'hod.']}
          defaultValue={data.data}
          label={t('user.employmentChangeData')}
          {...dataFieldProps}
        />
      ),
      label: 'Typ mzdy',
    },
    workFundH: {
      field: (
        <Input
          label={t('user.employmentChangeData')}
          {...dataFieldProps}
        />
      ),
      label: 'Pracovný fond hod.',
    },
    workFundD: {
      field: (
        <Input
          label={t('user.employmentChangeData')}
          {...dataFieldProps}
        />
      ),
      label: 'Pracovný fond dní',
    },
    workFundHW: {
      field: (
        <Input
          label={t('user.employmentChangeData')}
          {...dataFieldProps}
        />
      ),
      label: 'Pracovný fond hod./t.',
    },
  };

  const settingsOptions = (Object.keys(SETTINGS_FIELDS_MAP) as (keyof typeof SETTINGS_FIELDS_MAP)[]).map((mapKey) => ({
    value: mapKey,
    label: SETTINGS_FIELDS_MAP[mapKey]?.label,
  }));

  const settingType = watch('type');
  const settingData = watch('data');
  const settingDateFrom = watch('dateFrom');

  useEffect(() => {
    onChange({
      ...data,
      data: settingData,
      dateFrom: settingDateFrom,
      type: settingType,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingData, settingDateFrom, settingType]);

  useEffect(() => {
    if (triggerAllFields) {
      trigger();
    }
  }, [trigger, triggerAllFields]);

  return (
    <div className="row">
      <div className="cell">
        <Select
          options={settingsOptions}
          valuePath="value"
          labelPath="label"
          defaultValue={data.type}
          label={t('user.employmentChangeType')}
          error={!!errors.type}
          theme="gray"
          className="border-right"
          {...register('type', {
            onChange () {
              setValue('data', null);
              clearErrors('type');
            },
            required: true,
          })}
        />
      </div>
      <div className="cell">
        {settingType ? SETTINGS_FIELDS_MAP[settingType]?.field : <Input disabled className="border-right" label={t('user.employmentChangeData')} />}
      </div>
      <div className="cell">
        <Controller
          control={control}
          name="dateFrom"
          defaultValue={data.dateFrom || ''}
          rules={{
            required: true,
            onChange () {
              clearErrors('dateFrom');
            },
          }}
          render={({ field, fieldState }) => (
            <DatePicker
              error={!!fieldState.error}
              defaultValue={field.value as string}
              label={t('user.employmentChangeDateFrom')}
              onChange={field.onChange}
              inputProps={{ theme: 'gray' }}
              className="border-right"
              disabled={disabled}
            />
          )}
        />
      </div>
      <div className="cell">
        <Input className="border-right" label={t('user.employmentChangeCreatedBy')} disabled value={data.createdBy}/>
      </div>
      <div className="cell">
        <Input label={t('user.employmentChangeCreatedAt')} disabled value={getDateFromIso(data.createdAt, 'dd.MM.yyyy hh:mm')}/>
        <IconButton className="delete-btn" disabled={disabled} onClick={() => void onDelete()}><DeleteIcon size={16} /></IconButton>
      </div>
    </div>
  );
};

type Props = {
  data: ProjectPositionChange[];
  onSave(values: ProjectPositionChange[]): void;
};

const CustomProjectSettingsDataGrid = ({ data, onSave }: Props) => {
  const { t } = useTranslation();
  const { username } = useAuthData();

  const [settings, settingsActions, setSettings] = useListState(data);

  const [isOpenWarn, setIsOpenWarn] = useState(false);
  const [triggerAll, setTriggerAll] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  return (
    <CustomProjectSettingsDataGridWrapper>
      <div className="grid" ref={tableRef}>
        <div className="row">
          <div className="cell header">{t('user.employmentChangeType')}</div>
          <div className="cell header">{t('user.employmentChangeData')}</div>
          <div className="cell header">{t('user.employmentChangeDateFrom')}</div>
          <div className="cell header">{t('user.employmentChangeCreatedBy')}</div>
          <div className="cell header">{t('user.employmentChangeCreatedAt')}</div>
        </div>
        {settings.map((item) => (
          <CustomProjectSettingsDataGridRow
            key={item.matterId}
            data={item}
            onChange={(v) => void settingsActions.update(item, v)}
            onDelete={() => settingsActions.remove(item)}
            disabledForRecruiter={data.some(dataItem => dataItem.matterId === item.matterId)}
            triggerAllFields={triggerAll}
          />
        ))}
      </div>
      <Button
        onClick={() => void settingsActions.add({
          type: null,
          data: null,
          dateFrom: '',
          createdBy: username,
          createdAt: DateTime.now().toISO(),
          matterId: createId(),
        }, 'end')}
        variant="text"
      >
        <PlusIcon size={16} /> {t('add')}
      </Button>
      <div className="actions">
        <Button variant="outlined" onClick={() => void setSettings(data)}>{t('cancel')}</Button>
        <Button
          variant="outlined"
          color="warning"
          onClick={() => {
            setTriggerAll(true);
            setTimeout(() => {
              const formCardEl = tableRef.current;
              if (formCardEl) {
                const errorFields = formCardEl.querySelectorAll('.error');
                if (!errorFields.length) {
                  setIsOpenWarn(true);
                }
              }
              setTriggerAll(false);
            }, 100);
          }}
        >
          {t('save')}
        </Button>
      </div>
      <DialogConfirm
        onClose={() => void setIsOpenWarn(false)}
        open={isOpenWarn}
        onSubmit={() => {
          onSave(settings);
          setIsOpenWarn(false);
        }}
      />
    </CustomProjectSettingsDataGridWrapper>
  );
};

export default CustomProjectSettingsDataGrid;
