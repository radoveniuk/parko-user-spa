import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import In from 'v2/components/In';
import { BROKERS } from 'v2/constants/brokers';
import { PROJECT_TYPES } from 'v2/constants/projectType';
import { Button, FormControlLabel, Input, Radio } from 'v2/uikit';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import { FormCard, FormCardBody, FormCardBodyRow, FormCardHeader } from 'v2/uikit/FormCard';
import IconButton from 'v2/uikit/IconButton';
import Select from 'v2/uikit/Select';

import { useGetDictionary } from 'api/query/dictionariesQuery';
import { DeleteIcon, EditIcon, EyeIcon, EyeSlashIcon, PlusIcon, ProjectIcon, SaveIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import createId from 'helpers/createId';
import { getDateFromIso } from 'helpers/datetime';
import useListState from 'hooks/useListState';
import { IProject, ProjectPosition } from 'interfaces/project.interface';
import { themeConfig } from 'theme';

import { FormCardContent, PositionsWrapper, PositionWrapper, ProjectTitleWrapper, TypeRadioButtons, UpdatingStatsWrapper } from './styles';

type Props = {
  data: IProject;
  onChange(values: Partial<IProject>): void;
  onDelete(): void;
};

const ProjectFormCard = ({ data, onChange, onDelete }: Props) => {
  const { t } = useTranslation();
  const { register, control, watch, getValues, setValue } = useForm<IProject>({ defaultValues: data });
  const { permissions } = useAuthData();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState<ProjectPosition | null>(null);

  const [positions, { add: addPosition, remove: removePosition }] = useListState<ProjectPosition>(data.positions);

  const { data: cooperationTypeDictionary } = useGetDictionary('PROFILE_COOPERATION_TYPES');

  const createEmptyPosition = () => ({
    internalName: '',
    ISCO: '',
    name: '',
    address: '',
    employmentType: '',
    variability: 1,
    salary: 0,
    salaryType: '',
    workFundH: 8,
    workFundD: 5,
    workFundHW: 40,
    docs: [],
    matterId: createId(),
  });

  const onDeletePosition = () => {
    if (positionToDelete) {
      onChange({ positions: removePosition(positionToDelete) });
      setPositionToDelete(null);
    }
  };

  const isOutsorce = watch('type') === PROJECT_TYPES.Outsourcing.value;
  const isPodKmen = watch('type') === PROJECT_TYPES.Mediation.value;
  const isLeasing = watch('type') === PROJECT_TYPES.Leasing.value;

  return (
    <FormCard defaultConfig={{ disabled: true, isEditingTitle: false, viewPositions: [] as string[] }} className="project-card">
      {({ formCardConfig, updateFormCardConfig }) => (
        <FormCardContent>
          <FormCardHeader
            icon={<ProjectIcon />}
            title={(
              <ProjectTitleWrapper>
                {formCardConfig.isEditingTitle && (
                  <>
                    <Input
                      className="name-field"
                      variant="standard"
                      autoFocus
                      {...register('name')}
                    />
                    <IconButton
                      onClick={() => {
                        updateFormCardConfig({ isEditingTitle: false });
                      }}
                    >
                      <SaveIcon size={17} />
                    </IconButton>
                  </>
                )}
                {!formCardConfig.isEditingTitle && (
                  <>
                    <div className="project-name">{watch('name')}</div>
                    {!formCardConfig.disabled && (
                      <IconButton onClick={() => void updateFormCardConfig({ isEditingTitle: true })}><EditIcon /></IconButton>
                    )}
                  </>
                )}
              </ProjectTitleWrapper>
            )}
          >
            {formCardConfig.disabled && permissions.includes('projects:update') &&
            <Button onClick={() => void updateFormCardConfig({ disabled: false })}>{t('edit')}</Button>}
            {!formCardConfig.disabled && (
              <Button
                color="error"
                onClick={() => {
                  updateFormCardConfig({ disabled: true, isEditingTitle: false });
                  const values = getValues();
                  onChange?.(values);
                }}
              >
                {t('save')}
              </Button>
            )}
          </FormCardHeader>
          <FormCardBody>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <TypeRadioButtons value={field.value} onChange={field.onChange}>
                  <In
                    data={PROJECT_TYPES}
                    render={(_key, item) => (
                      <FormControlLabel
                        value={item.value}
                        control={<Radio />}
                        label={item.label}
                        disabled={formCardConfig.disabled}
                      />
                    )}
                  />
                </TypeRadioButtons>
              )}
            />
            {!!watch('type') && (
              <>
                {isPodKmen && (
                  <FormCardBodyRow>
                    <Input
                      theme="gray"
                      label="Zamestnavateľ"
                      disabled={formCardConfig.disabled}
                      {...register('zamestnavatel')}
                    />
                    <Select
                      theme="gray"
                      label="Sprostredkovateľ"
                      disabled={formCardConfig.disabled}
                      options={BROKERS}
                      labelPath="name"
                      valuePath="ico"
                      defaultValue={data.uzivatelskyZamestnavatel}
                      {...register('uzivatelskyZamestnavatel')}
                    />
                  </FormCardBodyRow>
                )}
                {isLeasing && (
                  <FormCardBodyRow>
                    <Input
                      theme="gray"
                      label="Zamestnavateľ"
                      disabled={formCardConfig.disabled}
                      {...register('zamestnavatel')}
                    />
                    <Input
                      theme="gray"
                      label="Uživateľský zamestnavateľ"
                      disabled={formCardConfig.disabled}
                      {...register('uzivatelskyZamestnavatel')}
                    />
                  </FormCardBodyRow>
                )}
                {isOutsorce && (
                  <FormCardBodyRow>
                    <Input
                      theme="gray"
                      label="Odoberateľ"
                      disabled={formCardConfig.disabled}
                      {...register('businessName')}
                    />
                    <Select
                      theme="gray"
                      label="Dodávateľ"
                      disabled={formCardConfig.disabled}
                      options={BROKERS}
                      labelPath="name"
                      valuePath="ico"
                      defaultValue={data.uzivatelskyZamestnavatel}
                      {...register('uzivatelskyZamestnavatel')}
                    />
                  </FormCardBodyRow>
                )}
              </>
            )}
            <PositionsWrapper>
              {positions.map((position, index) => (
                <PositionWrapper key={position.matterId}>
                  <IconButton
                    className="toggle-view"
                    onClick={() => {
                      updateFormCardConfig({
                        viewPositions: formCardConfig.viewPositions.includes(position.matterId)
                          ? formCardConfig.viewPositions.filter(item => item !== position.matterId)
                          : [...formCardConfig.viewPositions, position.matterId],
                      });
                    }}
                  >
                    {formCardConfig.viewPositions.includes(position.matterId)
                      ? <EyeIcon />
                      : <EyeSlashIcon color={themeConfig.palette.primary.main} />
                    }
                  </IconButton>
                  <div className="title"><b>Pracovná pozicia:</b> {watch(`positions.${index}.internalName`)}</div>
                  <div className={`fields ${!formCardConfig.viewPositions.includes(position.matterId) ? 'hide' : ''}`}>
                    <Input
                      label="Interný názov"
                      className="fullwidth"
                      disabled={formCardConfig.disabled}
                      {...register(`positions.${index}.internalName`)}
                    />
                    {!isOutsorce && (
                      <div className="position-ids fullwidth">
                        <span className="field-label">Pracovná pozícia (ISCO, Názov)</span>
                        <div className="inputs">
                          <Input
                            type="number"
                            disabled={formCardConfig.disabled}
                            {...register(`positions.${index}.ISCO`)}
                          />
                          <Input
                            disabled={formCardConfig.disabled}
                            {...register(`positions.${index}.name`)}
                          />
                        </div>
                      </div>
                    )}
                    {isOutsorce && (
                      <Input
                        label="Služba"
                        className="fullwidth"
                        disabled={formCardConfig.disabled}
                        {...register(`positions.${index}.name`)}
                      />
                    )}
                    <Input
                      label="Miesto výkonu práce"
                      className="fullwidth"
                      disabled={formCardConfig.disabled}
                      {...register(`positions.${index}.address`)}
                    />
                    {!isOutsorce && (
                      <Select
                        label="Typ pracovného pomeru"
                        options={cooperationTypeDictionary?.options}
                        disabled={formCardConfig.disabled}
                        defaultValue={position.employmentType}
                        {...register(`positions.${index}.employmentType`)}
                      />
                    )}
                    <Input
                      label="Zmennosť"
                      type="number"
                      {...register(`positions.${index}.variability`)}
                      disabled={formCardConfig.disabled}
                    />
                    <div className="salary">
                      <span className="field-label">Mzda</span>
                      <div className="inputs">
                        <Input
                          type="number"
                          disabled={formCardConfig.disabled}
                          {...register(`positions.${index}.salary`)}
                        />
                        <Select
                          options={['mes.', 'hod.']}
                          disabled={formCardConfig.disabled}
                          defaultValue={position.salaryType}
                          {...register(`positions.${index}.salaryType`)}
                        />
                      </div>
                    </div>
                    {!isOutsorce && (
                      <div className="work-fund">
                        <span className="field-label">Pracovný fond</span>
                        <div className="inputs">
                          <Input
                            type="number"
                            placeholder="hod."
                            disabled={formCardConfig.disabled}
                            {...register(`positions.${index}.workFundH`)}
                          />
                          <Input
                            type="number"
                            placeholder="dní"
                            disabled={formCardConfig.disabled}
                            {...register(`positions.${index}.workFundD`)}
                          />
                          <Input
                            type="number"
                            placeholder="hod./t."
                            disabled={formCardConfig.disabled}
                            {...register(`positions.${index}.workFundHW`)}
                          />
                        </div>
                      </div>
                    )}
                    {permissions.includes('projects:update') && (
                      <Button
                        variant="outlined"
                        color="error"
                        className="delete-position fullwidth"
                        onClick={() => void setPositionToDelete(position)}
                        disabled={formCardConfig.disabled}
                      >
                        <DeleteIcon color={formCardConfig.disabled ? '#717171' : themeConfig.palette.error.main} />{t('delete')}
                      </Button>
                    )}
                  </div>
                </PositionWrapper>
              ))}
            </PositionsWrapper>
            <Button
              variant="outlined"
              disabled={formCardConfig.disabled || !watch('type')}
              onClick={() => {
                const position = createEmptyPosition();
                addPosition(position);
                const currectPositions = getValues('positions') || [];
                setValue('positions', [...currectPositions, position]);
                updateFormCardConfig({
                  viewPositions: [...formCardConfig.viewPositions, position.matterId],
                });
              }}
            >
              <PlusIcon /> Pracovná pozicia
            </Button>
            {permissions.includes('projects:delete') && (
              <IconButton className="delete-icon" onClick={() => void setOpenDeleteDialog(true)}><DeleteIcon /></IconButton>
            )}
            <DialogConfirm
              open={openDeleteDialog}
              onClose={() => void setOpenDeleteDialog(false)}
              onSubmit={onDelete}
            />
            <DialogConfirm
              open={!!positionToDelete}
              onClose={() => void setPositionToDelete(null)}
              onSubmit={onDeletePosition}
            />
          </FormCardBody>
          <UpdatingStatsWrapper>
            <div className="info">
              {t('order.updatedAt')}: {getDateFromIso(data.updatedAt, 'dd.MM.yyyy HH:mm')} ({data.updatedBy?.fullname || data?.createdBy?.fullname})
            </div>
            <div className="info">{t('order.createdAt')}: {getDateFromIso(data.createdAt, 'dd.MM.yyyy HH:mm')} ({data?.createdBy?.fullname})</div>
          </UpdatingStatsWrapper>
        </FormCardContent>
      )}
    </FormCard>
  );
};

export default ProjectFormCard;
