import React, { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import isEmpty from 'lodash-es/isEmpty';
import set from 'lodash-es/set';
import In from 'v2/components/In';
import { Button, Input } from 'v2/uikit';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';
import Select from 'v2/uikit/Select';

import { PlusIcon } from 'components/icons';
import { EMPLOYMENT_TYPE } from 'constants/selectsOptions';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import { ProjectPosition } from 'interfaces/project.interface';

import { SettingsWrapper } from './styles';

type Props = Pick<DialogProps, 'open' | 'onClose'> & {
  onSubmit(settings: Partial<ProjectPosition>): void;
  defaultValues?: Partial<ProjectPosition>;
}

const CustomProjectSettingsDialog = ({ onSubmit, defaultValues, ...rest }: Props) => {
  const { t } = useTranslation();
  const employmentTypeOptions = useTranslatedSelect(EMPLOYMENT_TYPE, 'employmentType');

  const [settings, setSettings] = useState<Partial<ProjectPosition>>(defaultValues || {});

  const [isAddingSetting, setIsAddingSetting] = useState(false);

  const [highlitedField, setHighlitedField] = useState<keyof typeof settings | null>(null);

  const register = (key: keyof typeof settings) => ({
    value: settings[key],
    onChange: (e: any) => {
      setSettings((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));
    },
    theme: 'gray' as 'gray',
  });

  const SETTINGS_FIELDS_MAP: Partial<Record<keyof typeof settings, { field: ReactNode, label: string }>> = {
    address: {
      field: (
        <Input
          className={highlitedField === 'address' ? 'highlited' : ''}
          {...register('address')}
        />
      ),
      label: 'Miesto výkonu práce',
    },
    internalName: {
      field: (
        <Input
          className={highlitedField === 'internalName' ? 'highlited' : ''}
          {...register('internalName')}
        />
      ),
      label: 'Interný názov',
    },
    ISCO: {
      field: (
        <Input
          type="number"
          className={highlitedField === 'ISCO' ? 'highlited' : ''}
          {...register('ISCO')}
        />
      ),
      label: 'ISCO',
    },
    name: {
      field: (
        <Input
          className={highlitedField === 'name' ? 'highlited' : ''}
          {...register('name')}
        />
      ),
      label: 'Názov',
    },
    employmentType: {
      field: (
        <Select
          className={highlitedField === 'employmentType' ? 'highlited' : ''}
          options={employmentTypeOptions}
          {...register('employmentType')}
        />
      ),
      label: t('user.employmentType'),
    },
    variability: {
      field: (
        <Input
          type="number"
          className={highlitedField === 'variability' ? 'highlited' : ''}
          {...register('variability')}
        />
      ),
      label: 'Zmennosť',
    },
    salary: {
      field: (
        <Input
          className={highlitedField === 'salary' ? 'highlited' : ''}
          {...register('salary')}
        />
      ),
      label: 'Mzda',
    },
    salaryType: {
      field: (
        <Select
          className={highlitedField === 'salaryType' ? 'highlited' : ''}
          options={['mes.', 'hod.']}
          {...register('salaryType')}
        />
      ),
      label: 'Typ mzdy',
    },
    workFundH: {
      field: (
        <Input
          className={highlitedField === 'workFundH' ? 'highlited' : ''}
          {...register('workFundH')}
        />
      ),
      label: 'Pracovný fond hod.',
    },
    workFundD: {
      field: (
        <Input
          className={highlitedField === 'workFundD' ? 'highlited' : ''}
          {...register('workFundD')}
        />
      ),
      label: 'Pracovný fond dní',
    },
    workFundHW: {
      field: (
        <Input
          className={highlitedField === 'workFundHW' ? 'highlited' : ''}
          {...register('workFundHW')}
        />
      ),
      label: 'Pracovný fond hod./t.',
    },
  };

  const settingsOptions = (Object.keys(SETTINGS_FIELDS_MAP) as (keyof typeof SETTINGS_FIELDS_MAP)[]).map((mapKey) => ({
    value: mapKey,
    label: SETTINGS_FIELDS_MAP[mapKey]?.label,
  }));

  return (
    <Dialog
      mobileFullscreen
      title={t('user.updateEmploymentInfo')}
      {...rest}
    >
      <SettingsWrapper>
        {(!isEmpty(settings) || isAddingSetting) && (
          <div className="settings-grid">
            <div className="cell header">Údaj</div>
            <div className="cell header">Zmena</div>
            <In
              data={settings}
              render={(settingsKey) => (
                <>
                  <div className="cell">
                    <Select
                      options={settingsOptions}
                      valuePath="value"
                      labelPath="label"
                      value={settingsKey}
                      theme="gray"
                      disabled
                    />
                  </div>
                  <div className="cell">
                    {SETTINGS_FIELDS_MAP[settingsKey]?.field}
                  </div>
                </>
              )}
            />
            {isAddingSetting && (
              <>
                <div className="cell">
                  <Select
                    options={settingsOptions}
                    valuePath="value"
                    labelPath="label"
                    value=""
                    onChange={(e) => {
                      const settingKey = e.target.value as keyof typeof settings;
                      if (settings[settingKey]) {
                        setHighlitedField(settingKey);
                        setTimeout(() => {
                          setHighlitedField(null);
                        }, 500);
                      }
                      setSettings((prev) => ({
                        ...prev,
                        [settingKey]: prev[settingKey] || '',
                      }));
                      setIsAddingSetting(false);
                    }}
                    theme="gray"
                  />
                </div>
                <div className="cell"><Input disabled /></div>
              </>
            )}
          </div>
        )}
        <Button onClick={() => void setIsAddingSetting(true)} variant="text">
          <PlusIcon size={16} /> {t('add')}
        </Button>
      </SettingsWrapper>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            const settingsClone: typeof settings = {};
            for (const k in settings) {
              const key = k as keyof typeof settings;
              if (settings[key]) {
                set(settingsClone, key, settings[key]);
              }
            }
            onSubmit(settingsClone);
          }}
        >
          {t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomProjectSettingsDialog;
