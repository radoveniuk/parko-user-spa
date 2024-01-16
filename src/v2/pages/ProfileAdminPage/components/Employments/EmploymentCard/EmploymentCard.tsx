import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { DateTime } from 'luxon';
import { Button, Checkbox, Input } from 'v2/uikit';
import DatePicker from 'v2/uikit/DatePicker';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import { FormCard, FormCardBody, FormCardBodyRow, FormCardHeader } from 'v2/uikit/FormCard';
import IconButton from 'v2/uikit/IconButton';
import Select from 'v2/uikit/Select';

import { EyeIcon, EyeSlashIcon, ProjectIcon } from 'components/icons';
import { getDateFromIso } from 'helpers/datetime';
import { IClient } from 'interfaces/client.interface';
import { IEmployment } from 'interfaces/employment.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';
import { themeConfig } from 'theme';

import CustomProjectSettingsDialog from './CustomProjectSettingsDialog';
import { EmploymentCardTitleWrapper, EmploymentCardWrapper } from './styles';

type Props = {
  data: IEmployment;
  projects: Partial<IProject>[];
  clients: Partial<IClient>[];
  onChange(values: Partial<IEmployment>): void;
};

const EmploymentCard = ({ data, projects, clients, onChange }: Props) => {
  const { t } = useTranslation();
  const { register, handleSubmit, watch, control, setValue } = useForm<IEmployment>({ defaultValues: data as any });
  const queryClient = useQueryClient();
  const { id: userId } = useParams();

  const submitHandler: SubmitHandler<IEmployment> = (values) => {
    onChange(values);
  };

  const project = projects.find((projectItem) => projectItem._id === watch('project'));
  const position = project?.positions?.find((positionItem) => positionItem.matterId === watch('positionId'));
  const user = queryClient.getQueryData(['user-data', userId]) as IUser;

  const hireDate = watch('hireDate');
  const status = watch('status');

  const daysCount = hireDate ? DateTime.now().diff(DateTime.fromISO(hireDate)).milliseconds / 86_400_000 : 0;

  const [dialogStatus, setDialogStatus] = useState<null | 'canceled' | 'hired' | 'fired'>(null);
  const [openCustomSettings, setOpenCustomSettings] = useState<boolean>(false);

  return (
    <>
      <FormCard defaultConfig={{ disabled: true, viewEmployer: false, viewEmployee: false }}>
        {({ formCardConfig, updateFormCardConfig }) => (
          <>
            <FormCardHeader
              icon={<ProjectIcon />}
              title={(
                <EmploymentCardTitleWrapper>
                  {project?.type === 'Outsourcing' ? t('user.individualCooperation') : t('user.employment')}
                  <div className={`status ${status}`}>{t(`selects.userPositionEmploymentStatus.${status}`)}</div>
                </EmploymentCardTitleWrapper>
              )}
            >
              {formCardConfig.disabled && (
                <Button onClick={() => void updateFormCardConfig({ disabled: false })}>{t('edit')}</Button>
              )}
              {!formCardConfig.disabled && (
                <Button
                  color="error"
                  onClick={() => {
                    handleSubmit(submitHandler)();
                    updateFormCardConfig({ disabled: true });
                  }}
                >
                  {t('save')}
                </Button>
              )}
            </FormCardHeader>
            <FormCardBody>
              <EmploymentCardWrapper>
                <FormCardBodyRow>
                  <Select
                    label={t('project.client')}
                    theme="gray"
                    labelPath="name"
                    valuePath="_id"
                    options={clients}
                    disabled={formCardConfig.disabled}
                    defaultValue={data?.client}
                    {...register('client')}
                  />
                  <Select
                    label={t('user.project')}
                    theme="gray"
                    labelPath="name"
                    valuePath="_id"
                    options={projects.filter((projectItem) => (projectItem.client as IClient)._id === watch('client'))}
                    disabled={formCardConfig.disabled}
                    defaultValue={data?.project}
                    {...register('project')}
                  />
                  <div className="fullwidth">
                    <Select
                      label="Pracovná pozicia"
                      theme="gray"
                      labelPath="internalName"
                      valuePath="matterId"
                      options={project?.positions}
                      disabled={formCardConfig.disabled}
                      defaultValue={data?.positionId}
                      {...register('positionId')}
                    />
                  </div>
                  <div className="fullwidth static-info">
                    <IconButton
                      className="toggle-view"
                      onClick={() => {
                        updateFormCardConfig({ viewEmployer: !formCardConfig.viewEmployer });
                      }}
                    >
                      {!formCardConfig.viewEmployer
                        ? <EyeIcon />
                        : <EyeSlashIcon color={themeConfig.palette.primary.main} />
                      }
                    </IconButton>
                    <b className="title">{t('employer')}</b>
                    <div className={`info${formCardConfig.viewEmployer ? '' : ' hide'}`}>
                      <div className="row">
                        Zamestnavateľ: {project?.zamestnavatel}
                      </div>
                      <div className="row">
                        Uživateľský zamestnavateľ: {project?.uzivatelskyZamestnavatel}
                      </div>
                      <div className="row">
                        Pracovná pozícia (ISCO, Názov): {position?.ISCO}, {position?.name}
                      </div>
                      <div className="row">
                        Typ pracovného pomeru: {position?.employmentType}
                      </div>
                      <div className="row">
                        Zmennosť: {position?.variability}
                      </div>
                      <div className="row">
                        Mzda: {position?.salary.toFixed(2).replace('.', ',')} €/{position?.salaryType}
                      </div>
                      <div className="row">
                        Pracovný fond:
                        <ul>
                          <li>{position?.workFundH} hod. denné</li>
                          <li>{position?.workFundD} pracovných dní týždenné</li>
                          <li>{position?.workFundHW} hod. týždenné</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="fullwidth static-info">
                    <IconButton
                      className="toggle-view"
                      onClick={() => {
                        updateFormCardConfig({ viewEmployee: !formCardConfig.viewEmployee });
                      }}
                    >
                      {!formCardConfig.viewEmployee
                        ? <EyeIcon />
                        : <EyeSlashIcon color={themeConfig.palette.primary.main} />
                      }
                    </IconButton>
                    <b className="title">{t('employee')}</b>
                    <div className={`info${formCardConfig.viewEmployee ? '' : ' hide'}`}>
                      <div className="row">Meno: {user.name}</div>
                      <div className="row">Priezvisko: {user.surname}</div>
                      <div className="row">Rodne priezvisko: {user.birthSurname}</div>
                      <div className="row">Dátum narodenia: {getDateFromIso(user.birthDate)}</div>
                      <div className="row">Miesto narodenia: {user.birthPlace}</div>
                      <div className="row">Zdravotna poistovna: {user.medicalInsurance}</div>
                      <div className="row">Národnosť: {user.country}</div>
                      <div className="row">Statna prislusnost: {user.country}</div>
                      <div className="row">Pohlavie: {user.sex}</div>
                      <div className="row">Rodiny stav: {user.familyStatus}</div>
                      <div className="row">IBAN: {user.IBAN}</div>
                      <div className="row">Adresa: {user.adress}</div>
                      <div className="row">PSČ: {user.zip}</div>
                      <div className="row">Mesto: {user.city}</div>
                      <div className="row">Krajina: {user.country}</div>
                      <div className="row">Email: {user.email}</div>
                      <div className="row">Rodne cislo: {user.rodneCislo}</div>
                      <div className="row">Číslo OP: {user.passNumber}</div>
                    </div>
                  </div>
                  <Controller
                    control={control}
                    name="hireDate"
                    render={({ field }) => (
                      <DatePicker
                        inputProps={{ theme: 'gray' }}
                        defaultValue={field.value}
                        onChange={field.onChange}
                        label={t('user.hireDate')}
                        onBlur={field.onBlur}
                        format="dd.MM.yyyy HH:mm"
                        disabled={formCardConfig.disabled}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="fireDate"
                    render={({ field }) => (
                      <DatePicker
                        inputProps={{ theme: 'gray' }}
                        defaultValue={field.value}
                        onChange={field.onChange}
                        label={t('user.fireDate')}
                        onBlur={field.onBlur}
                        format="dd.MM.yyyy"
                        disabled={formCardConfig.disabled}
                      />
                    )}
                  />
                  <Input
                    label={t('user.fireReason')}
                    theme="gray"
                    disabled={formCardConfig.disabled}
                  />
                  <Input
                    label={t('comment')}
                    theme="gray"
                    disabled={formCardConfig.disabled}
                  />
                  <div className="fullwidth">
                    <Controller
                      control={control}
                      name="isNonTaxablePart"
                      render={({ field }) => (
                        <Checkbox
                          label="Uplatnenie nezdaniteľej časti zakladu dane"
                          checked={field.value}
                          onChange={field.onChange}
                          disabled={formCardConfig.disabled}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="isChildTaxBonus"
                      render={({ field }) => (
                        <Checkbox
                          label="Uplatnenie daňového bonusu na dieťa"
                          checked={field.value}
                          onChange={field.onChange}
                          disabled={formCardConfig.disabled}
                        />
                      )}
                    />
                  </div>
                </FormCardBodyRow>
                <div className="buttons">
                  <Button variant="outlined" disabled={!!status} onClick={() => void setDialogStatus('hired')}>{t('user.hire')}</Button>
                  <Button variant="outlined" onClick={() => void setOpenCustomSettings(true)}>{t('user.change')}</Button>
                  <Button
                    variant="outlined"
                    disabled={status !== 'hired' || daysCount > 2}
                    onClick={() => void setDialogStatus('canceled')}
                  >
                    {t('user.cancel')}
                  </Button>
                  <Button
                    variant="outlined"
                    disabled={status !== 'hired'}
                    onClick={() => void setDialogStatus('fired')}
                  >
                    {t('user.fire')}
                  </Button>
                </div>
              </EmploymentCardWrapper>
            </FormCardBody>
          </>
        )}
      </FormCard>
      <DialogConfirm
        open={dialogStatus !== null}
        onClose={() => void setDialogStatus(null)}
        onSubmit={() => {
          setDialogStatus(null);
          if (dialogStatus !== null) {
            setValue('status', dialogStatus);
            onChange({ status: dialogStatus });
          }
        }}
      />
      <CustomProjectSettingsDialog
        open={openCustomSettings}
        onClose={() => void setOpenCustomSettings(false)}
        defaultValues={data.changes}
        onSubmit={(changes) => {
          setOpenCustomSettings(false);
          onChange({ changes });
        }}
      />
    </>
  );
};

export default EmploymentCard;