import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, FormControlLabel, Input, Radio } from 'v2/uikit';
import FileInput from 'v2/uikit/FileInput';
import { FormCard, FormCardBody, FormCardBodyRow, FormCardHeader } from 'v2/uikit/FormCard';
import IconButton from 'v2/uikit/IconButton';
import Select from 'v2/uikit/Select';

import { uploadFiles } from 'api/common';
import { useGetDictionary } from 'api/query/dictionariesQuery';
import { EditIcon, EyeIcon, EyeSlashIcon, PlusIcon, ProjectIcon, SaveIcon, UploadIcon } from 'components/icons';
import createId from 'helpers/createId';
import useListState from 'hooks/useListState';
import { IProject, ProjectPosition } from 'interfaces/project.interface';
import { themeConfig } from 'theme';

import { PositionsWrapper, PositionWrapper, ProjectTitleWrapper, TypeRadioButtons } from './styles';

type Props = {
  data: IProject;
  onChange?(values: Partial<IProject>): void;
};

const ProjectFormCard = ({ data, onChange }: Props) => {
  const { t } = useTranslation();
  const { register, control, watch, getValues } = useForm<IProject>({ defaultValues: data });

  const [positions, { add: addPosition }] = useListState<ProjectPosition>(data.positions);

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

  const isOutsorce = watch('type') === 'Outsourcing';

  return (
    <FormCard defaultConfig={{ disabled: true, isEditingTitle: false, viewPositions: [] as string[] }} className="project-card">
      {({ formCardConfig, updateFormCardConfig }) => (
        <>
          <FormCardHeader
            icon={<ProjectIcon />}
            title={(
              <ProjectTitleWrapper>
                {formCardConfig.isEditingTitle && (
                  <>
                    <Input autoFocus {...register('name')} />
                    <IconButton
                      onClick={() => {
                        const { name } = getValues();
                        onChange?.({ name });
                        updateFormCardConfig({ isEditingTitle: false });
                      }}
                    >
                      <SaveIcon size={17} />
                    </IconButton>
                  </>
                )}
                {!formCardConfig.isEditingTitle && (
                  <>
                    {watch('name')}
                    <IconButton onClick={() => void updateFormCardConfig({ isEditingTitle: true })}><EditIcon /></IconButton>
                  </>
                )}
              </ProjectTitleWrapper>
            )}
          >
            {formCardConfig.disabled && <Button onClick={() => void updateFormCardConfig({ disabled: false })}>{t('edit')}</Button>}
            {!formCardConfig.disabled && (
              <Button
                color="error"
                onClick={() => {
                  updateFormCardConfig({ disabled: true });
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
                  <FormControlLabel
                    value="Pod kmeň"
                    control={<Radio />}
                    label="Pod kmeň"
                    disabled={formCardConfig.disabled}
                  />
                  <FormControlLabel
                    value="Outsourcing"
                    control={<Radio />}
                    label="Outsourcing"
                    disabled={formCardConfig.disabled}
                  />
                  <FormControlLabel
                    value="HR Service"
                    control={<Radio />}
                    label="HR Service"
                    disabled={formCardConfig.disabled}
                  />
                </TypeRadioButtons>
              )}
            />
            {!!watch('type') && (
              <>
                {!isOutsorce && (
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
                      label="Obchodné meno"
                      disabled={formCardConfig.disabled}
                      {...register('businessName')}
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
                    {/* {!isOutsorce && (
                      <Controller
                        control={control}
                        name={`positions.${index}.docs`}
                        render={({ field }) => (
                          <>
                            <FileInput
                              disabled={formCardConfig.disabled}
                              multiple
                              className="FileInput"
                              onChange={async (e) => {
                                if (e.target.files?.length) {
                                  const formData = new window.FormData();
                                  formData.append('files', e.target.files[0]);
                                  const [uploadedFileData] = await uploadFiles(formData);
                                  field.onChange(uploadedFileData);
                                }
                              }}
                            >
                              <Button
                                variant="outlined"
                                disabled={formCardConfig.disabled}
                              >
                                <UploadIcon />
                                {t('docs')}
                              </Button>
                            </FileInput>
                          </>
                        )}
                      />
                    )} */}
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
                updateFormCardConfig({
                  viewPositions: [...formCardConfig.viewPositions, position.matterId],
                });
              }}
            >
              <PlusIcon /> Pracovná pozicia
            </Button>
          </FormCardBody>
        </>
      )}
    </FormCard>
  );
};

export default ProjectFormCard;
