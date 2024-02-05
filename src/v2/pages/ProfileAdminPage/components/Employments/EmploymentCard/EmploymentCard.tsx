import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { DateTime } from 'luxon';
import { useSnackbar } from 'notistack';
import { getProjectType } from 'v2/constants/projectType';
import { Button, Checkbox, Input } from 'v2/uikit';
import DatePicker from 'v2/uikit/DatePicker';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import { FormCard, FormCardBody, FormCardBodyRow, FormCardHeader } from 'v2/uikit/FormCard';
import IconButton from 'v2/uikit/IconButton';
import Select from 'v2/uikit/Select';
import StatusLabel from 'v2/uikit/StatusLabel';

import { DeleteIcon, EyeIcon, EyeSlashIcon, ProjectIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { IClient } from 'interfaces/client.interface';
import { IEmployment } from 'interfaces/employment.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';
import { themeConfig } from 'theme';

import CustomProjectSettingsDialog from './CustomProjectSettingsDialog';
import { EmploymentCardTitleWrapper, EmploymentCardWrapper, FormCardContent } from './styles';

type Props = {
  data: IEmployment;
  projects: Partial<IProject>[];
  clients: Partial<IClient>[];
  onChange(values: Partial<IEmployment>): void;
  onDelete(): void;
};

const EmploymentCard = ({ data, projects, clients, onChange, onDelete }: Props) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const {
    handleSubmit, watch, control, setValue, clearErrors, register,
  } = useForm<IEmployment>({ defaultValues: data as any });
  const queryClient = useQueryClient();
  const { id: userId } = useParams();
  const { role } = useAuthData();

  const submitHandler: SubmitHandler<IEmployment> = (values) => {
    onChange(values);
  };

  const project = projects?.find((projectItem) => projectItem._id === watch('project'));
  const position = project?.positions?.find((positionItem) => positionItem.matterId === watch('positionId'));
  const user = queryClient.getQueryData(['user-data', userId]) as IUser;

  const hireDate = watch('hireDate');
  const fireDate = watch('fireDate');
  const status = watch('status');
  const fireReason = watch('fireReason');

  const daysCount = hireDate ? DateTime.now().diff(DateTime.fromISO(hireDate)).milliseconds / 86_400_000 : 0;

  const [dialogStatus, setDialogStatus] = useState<null | 'canceled' | 'hired' | 'fired'>(null);
  const [openCustomSettings, setOpenCustomSettings] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const saveDataNotification = () => {
    enqueueSnackbar('Najprv uložte zmeny', { variant: 'warning' });
  };

  const disableHire = !!status || !hireDate || !project || !position;
  const disableCancel = status !== 'hired' || daysCount > 2;
  const disableChanges = status === 'canceled';
  const disableFire = status !== 'hired' || !fireDate || !fireReason;

  return (
    <FormCardContent>
      <FormCard
        className="EmploymentCard"
        defaultConfig={{ disabled: true, viewEmployer: false, viewEmployee: false }}
        onOutsideClick={({ warn }) => { warn(); }}
      >
        {({ formCardConfig, updateFormCardConfig }) => (
          <>
            <FormCardHeader
              icon={<ProjectIcon />}
              title={(
                <EmploymentCardTitleWrapper>
                  {project?.type === 'Outsourcing' ? t('user.individualCooperation') : t('user.employment')}
                  <StatusLabel className={`status ${status}`}>{t(`selects.userPositionEmploymentStatus.${status}`)}</StatusLabel>
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
                    handleSubmit((values) => {
                      submitHandler(values);
                      updateFormCardConfig({ disabled: true });
                    })();
                  }}
                >
                  {t('save')}
                </Button>
              )}
            </FormCardHeader>
            <FormCardBody>
              <EmploymentCardWrapper>
                <FormCardBodyRow>
                  <Controller
                    control={control}
                    name="client"
                    rules={{ required: true }}
                    render={({ field, fieldState }) => (
                      <Select
                        label={t('project.client')}
                        theme="gray"
                        labelPath="name"
                        valuePath="_id"
                        options={clients}
                        disabled={formCardConfig.disabled}
                        defaultValue={data?.client}
                        error={!!fieldState.error}
                        value={field.value}
                        onChange={(e) => {
                          clearErrors('client');
                          field.onChange(e.target.value);
                        }}
                        className="select-field"
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="project"
                    rules={{ required: true }}
                    render={({ field, fieldState }) => (
                      <Select
                        label={t('user.project')}
                        theme="gray"
                        labelPath={item => `${item.name}${item.type ? `, ${getProjectType(item.type)?.label}` : ''}`}
                        valuePath="_id"
                        options={projects?.filter((projectItem) => (projectItem.client as IClient)?._id === watch('client'))}
                        disabled={formCardConfig.disabled || !watch('client')}
                        defaultValue={data?.project}
                        error={!!fieldState.error}
                        value={field.value}
                        onChange={(e) => {
                          clearErrors('project');
                          field.onChange(e.target.value);
                        }}
                      />
                    )}
                  />
                  <div className="fullwidth">
                    <Controller
                      control={control}
                      name="positionId"
                      rules={{ required: true }}
                      render={({ field, fieldState }) => (
                        <Select
                          label="Pracovná pozicia"
                          theme="gray"
                          labelPath="internalName"
                          valuePath="matterId"
                          options={project?.positions}
                          disabled={formCardConfig.disabled || !watch('project')}
                          defaultValue={data?.positionId}
                          error={!!fieldState.error}
                          value={field.value}
                          onChange={(e) => {
                            clearErrors('positionId');
                            field.onChange(e.target.value);
                          }}
                        />
                      )}
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
                    <b className="title">{project?.type === 'Outsourcing' ? 'Odoberateľ' : t('employer')}</b>
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
                        Mzda: {Number(position?.salary).toFixed(2).replace('.', ',')} €/{position?.salaryType}
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
                    <b className="title">{project?.type === 'Outsourcing' ? 'SubDodávateľ' : t('employee')}</b>
                    <div className={`info${formCardConfig.viewEmployee ? '' : ' hide'}`}>
                      <div className="row">Meno: {user.name}</div>
                      <div className="row">Priezvisko: {user.surname}</div>
                      <div className="row">Rodne priezvisko: {user.birthSurname}</div>
                      <div className="row">Dátum narodenia: {getDateFromIso(user.birthDate)}</div>
                      <div className="row">Miesto narodenia: {user.birthPlace}</div>
                      <div className="row">Zdravotna poistovna: {user.medicalInsurance}</div>
                      <div className="row">Národnosť: {user.country}</div>
                      <div className="row">Statna prislusnost: {user.country}</div>
                      <div className="row">Pohlavie: {t(user.sex)}</div>
                      <div className="row">Rodiny stav: {t(`selects.familyStatus.${user.familyStatus}`)}</div>
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
                    rules={{ required: true }}
                    render={({ field, fieldState }) => (
                      <DatePicker
                        inputProps={{ theme: 'gray' }}
                        defaultValue={field.value}
                        onChange={field.onChange}
                        label={t('user.hireDate')}
                        onBlur={field.onBlur}
                        format="dd.MM.yyyy HH:mm"
                        disabled={formCardConfig.disabled}
                        error={!!fieldState.error}
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
                    {...register('fireReason')}
                  />
                  <Input
                    label={t('comment')}
                    theme="gray"
                    disabled={formCardConfig.disabled}
                    {...register('comment')}
                  />
                  {project?.type !== 'Outsourcing' && (
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
                  )}
                </FormCardBodyRow>
                <div className="buttons">
                  <Button
                    variant="outlined"
                    disabled={disableHire}
                    onClick={() => {
                      if (!formCardConfig.disabled) return saveDataNotification();
                      setDialogStatus('hired');
                    }}
                  >
                    {t('user.hire')}
                  </Button>
                  <Button
                    variant="outlined"
                    disabled={disableChanges}
                    onClick={() => {
                      if (!formCardConfig.disabled) return saveDataNotification();
                      setOpenCustomSettings(true);
                    }}
                  >
                    {t('user.change')}
                  </Button>
                  <Button
                    variant="outlined"
                    disabled={disableCancel}
                    onClick={() => {
                      if (!formCardConfig.disabled) return saveDataNotification();
                      setDialogStatus('canceled');
                    }}
                  >
                    {t('user.cancel')}
                  </Button>
                  <Button
                    variant="outlined"
                    disabled={disableFire}
                    onClick={() => {
                      if (!formCardConfig.disabled) return saveDataNotification();
                      setDialogStatus('fired');
                    }}
                  >
                    {t('user.fire')}
                  </Button>
                </div>
              </EmploymentCardWrapper>
              {role === 'admin' && <IconButton className="delete-icon" onClick={() => void setOpenDeleteDialog(true)}><DeleteIcon /></IconButton>}
              <DialogConfirm
                open={openDeleteDialog}
                onClose={() => void setOpenDeleteDialog(false)}
                onSubmit={onDelete}
              />
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
    </FormCardContent>
  );
};

export default EmploymentCard;
