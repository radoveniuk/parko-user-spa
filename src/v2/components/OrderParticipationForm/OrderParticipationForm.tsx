import React, { useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import set from 'lodash-es/set';
import { Button, Input, Menu, MenuItem } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';

import { useDownloadPrintedTemplate } from 'api/mutations/docsTemplateMutation';
import { DeleteIcon, DownloadFileIcon, EditIcon, EyeIcon, EyeSlashIcon, PlusIcon, ThreeDotsIcon } from 'components/icons';
import { EXPIRIENCE_METHOD_OPTIONS } from 'constants/selectsOptions';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { ICustomFormField } from 'interfaces/form.interface';
import { IOrderParticipation, IOrderParticipationStage } from 'interfaces/orderParticipation.interface';
import { themeConfig } from 'theme';

import ScreaningDialog from '../ScreaningDialog';

import StageDialog from './StageDialog';
import { FormWrapper, InfoWrapper, ReadonlyExperience, StagesTable } from './styles';

type Props = {
  disabled?: boolean;
};

const OrderParticipationForm = ({ disabled }: Props) => {
  const { t, i18n } = useTranslation();
  const { username } = useAuthData();
  const { control, watch, setValue, register, getValues } = useFormContext<IOrderParticipation<true>>();
  const [selectedInfoSection, setSelectedInfoSection] = useState<'order' | 'screaning' | null>(null);

  const infoSectionToggler = (name: 'order' | 'screaning') => () => {
    setSelectedInfoSection(prev => prev === name ? null : name);
  };

  const order = watch('order');
  const screaning = watch('screaning');

  const screaningStat = useMemo(() => {
    const requiredFieldsIds = order.form?.requiredFields || [];
    let completedRequirderFieldsCount = 0;
    Object.keys(screaning || {}).forEach((fieldId) => {
      if (requiredFieldsIds.includes(fieldId)) {
        completedRequirderFieldsCount += 1;
      }
    });
    // eslint-disable-next-line max-len
    return `${completedRequirderFieldsCount} / ${requiredFieldsIds.length} (${((requiredFieldsIds.length ? completedRequirderFieldsCount / requiredFieldsIds.length : 1) * 100).toFixed().replace('.', ',')}%)`;
  }, [order.form?.requiredFields, screaning]);

  const renderCustomFieldValue = (id: string) => {
    const fieldData = order.form?.fields.find((field) => (field as ICustomFormField)._id === id) as ICustomFormField | undefined;

    if (['string', 'email', 'number', 'phone', 'select', 'textarea'].includes(fieldData?.type as string)) {
      return <><b>{fieldData?.names[i18n.language]}:</b> {screaning[id]}</>;
    }

    if (fieldData?.type === 'multiselect') {
      return <><b>{fieldData?.names[i18n.language]}:</b> {screaning[id]?.map((item: { label: string; }) => item.label).join(', ')}</>;
    }

    if (fieldData?.type === 'experience') {
      return (
        <>
          <b>{fieldData?.names[i18n.language]}:</b>
          {screaning[id]?.map((
            item: { matterId: string; company: string; dates: string; position: string; fireMethod: string, fireReason: string }, index: number,
          ) => (
            <ReadonlyExperience key={item.matterId}>
              <div className="title">
                {index + 1}.
                <div className="company">{t('workExperience.company')}: {item.company}</div>
              </div>
              <ul className="data">
                <li>{t('workExperience.dates')}: {item.dates}</li>
                <li>{t('workExperience.position')}: {item.position}</li>
                <li>{t('workExperience.fireMethod')}: {EXPIRIENCE_METHOD_OPTIONS.find(option => option.value === item.fireMethod)?.label}</li>
                <li>{t('workExperience.fireReason')}: {item.fireReason}</li>
              </ul>
            </ReadonlyExperience>
          ))}
        </>
      );
    }
  };

  // screaning updates
  const [openScreaning, setOpenScreaning] = useState(false);
  const screaningSubmit = (values: Record<string, any>) => {
    setValue('screaning', values);
  };

  // stages updates
  const [openStageDialog, setOpenStageDialog] = useState<boolean | IOrderParticipationStage>(false);

  // download summary

  const downloadPrintedSummary = useDownloadPrintedTemplate();
  const downloadSummary = async () => {
    const fileId = getValues('order.form.summaryTemplate') as string;
    const screaning = getValues('screaning');
    const user = getValues('user.fullname');
    const formFields = getValues('order.form.fields');

    const fileData: Record<string, string> = {};

    for (const key in screaning) {
      if (Object.prototype.hasOwnProperty.call(screaning, key)) {
        const screaningValue = screaning[key];
        const fieldData = formFields.find(field => (field as ICustomFormField)._id === key) as ICustomFormField | undefined;
        if (fieldData) {
          if (fieldData.type === 'multiselect') {
            set(fileData, key, screaningValue.map((option: { label: string; }) => option.label).join(','));
          } else if (fieldData.type === 'boolean') {
            set(fileData, key, t(screaningValue));
          } else if (fieldData.type === 'date') {
            set(fileData, key, getDateFromIso(screaningValue));
          } else if (fieldData.type === 'experience') {
            // eslint-disable-next-line max-len
            set(fileData, key, screaningValue.map((expirienceItem: { company: string; dates: string; position: string; fireMethod: string; fireReason: string; }, index: number) => `Pracovná skúsenost ${index + 1}:\nSpoločnosť: ${expirienceItem.company},\nOd - Do: ${expirienceItem.dates},\nPozícia: ${expirienceItem.position}\nSpôsob ukončenia: ${EXPIRIENCE_METHOD_OPTIONS.find(item => item.value === expirienceItem.fireMethod)?.label || ''},\nDôvod ukončenia: ${expirienceItem.fireReason}.`).join('\n'));
          } else {
            set(fileData, key, screaningValue);
          }
        }
      }
    }

    if (fileId) {
      await downloadPrintedSummary({ fileId, fileData }, `${user}.docx`);
    }
  };

  return (
    <FormWrapper>
      <InfoWrapper className="fullwidth">
        <IconButton
          className="toggle-view"
          onClick={infoSectionToggler('order')}
        >
          {selectedInfoSection !== 'order' ? <EyeIcon /> : <EyeSlashIcon color={themeConfig.palette.primary.main} />}
        </IconButton>
        <div className="title"><b>{t('order.specification')}</b></div>
        <div className={`info ${selectedInfoSection !== 'order' ? 'hide' : ''}`}>
          <div className="row">
            <b>{t('order.client')}:</b> {order.client.shortName}
          </div>
          <div className="row">
            <b>{t('order.project')}:</b> {order.project.name}
          </div>
          <div className="row">
            <b>{t('order.status')}:</b> {t(`selects.orderStatus.${order.status}`)}
          </div>
          <div className="row">
            <b>{t('order.positionName')}:</b> {order.project.positions?.find(position => position.matterId === order.positionId)?.internalName}
          </div>
          <div className="row">
            <b>{t('order.cooperationType')}:</b> {t(`selects.orderCooperationType.${order.cooperationType}`)}
          </div>
          <div className="row">
            <b>{t('order.salary')}:</b> {order.salary}
          </div>
          <div className="row">
            <b>{t('order.location')}:</b> {order.location}
          </div>
          <div className="row">
            <b>{t('order.variability')}:</b> {order.variability}
          </div>
          <div className="row">
            <b>{t('order.managers')}:</b> {order.managers?.map((item) => `${item.fullname}`).join(', ')}
          </div>
          <a className="row link" href={order.specificationUrl} target="_blank" rel="noreferrer">{t('order.specificationUrl')}</a>
        </div>
      </InfoWrapper>
      <InfoWrapper className="fullwidth">
        <IconButton
          className="toggle-view"
          onClick={infoSectionToggler('screaning')}
        >
          {selectedInfoSection !== 'screaning' ? <EyeIcon /> : <EyeSlashIcon color={themeConfig.palette.primary.main} />}
        </IconButton>
        <div className="title"><b>{t('order.screaning')} {screaningStat}</b></div>
        <div className={`info ${selectedInfoSection !== 'screaning' ? 'hide' : ''}`}>
          {Object.keys(screaning || {}).map((customFieldId) => (
            <div className="row" key={customFieldId}>{renderCustomFieldValue(customFieldId)}</div>
          ))}
          <div className="actions">
            <Button variant="outlined" disabled={disabled} onClick={() => void setOpenScreaning(true)}><EditIcon /> {t('edit')}</Button>
            {watch('order.form.summaryTemplate') && (
              <Button variant="outlined" onClick={downloadSummary}><DownloadFileIcon /> {t('download')}</Button>
            )}
          </div>
        </div>
      </InfoWrapper>
      <Controller
        control={control}
        name="stages"
        render={({ field }) => {
          const availableStages = order.stages.filter(stage => !field.value.some(fieldValueStage => fieldValueStage.stage.name === stage.name));
          return (
            <div className="fullwidth">
              <StagesTable>
                <thead>
                  <tr>
                    <th>{t('order.stage')}</th>
                    <th>{t('order.stageFrom')}</th>
                    <th>{t('order.createdBy')}</th>
                    <th>{t('comment')}</th>
                  </tr>
                </thead>
                <tbody>
                  {field.value.map((stageItem) => (
                    <tr key={stageItem.stage.name}>
                      <td>{stageItem.stage.name}</td>
                      <td>
                        {getDateFromIso(stageItem.date, 'dd.MM.yyyy HH:mm')}
                      </td>
                      <td>{stageItem.createdByName}</td>
                      <td>
                        {stageItem.comment}
                        <Menu menuComponent={<IconButton className="edit-btn" disabled={disabled}><ThreeDotsIcon size={14} /></IconButton>}>
                          <MenuItem onClick={() => void setOpenStageDialog(stageItem)}>
                            <EditIcon />{t('edit')}
                          </MenuItem>
                          <MenuItem onClick={() => void field.onChange(field.value.filter(item => item.stage.name !== stageItem.stage.name))}>
                            <DeleteIcon />{t('delete')}
                          </MenuItem>
                        </Menu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </StagesTable>
              {!!availableStages.length && (
                <Button variant="outlined" disabled={disabled} onClick={() => void setOpenStageDialog(true)}><PlusIcon />{t('add')}</Button>
              )}
              {!!openStageDialog && (
                <StageDialog
                  title={t('order.stage')}
                  open={!!openStageDialog}
                  onClose={() => void setOpenStageDialog(false)}
                  onSubmit={(v) => {
                    setOpenStageDialog(false);
                    if (typeof openStageDialog === 'boolean') {
                      field.onChange([...field.value, { ...v, createdByName: username }]);
                    } else {
                      field.onChange(
                        field.value.map(item => item.stage.name === openStageDialog.stage.name ? { ...v, createdByName: username } : item),
                      );
                    }
                  }}
                  stageOptions={typeof openStageDialog !== 'boolean' ? [openStageDialog.stage, ...availableStages] : availableStages}
                  defaultData={typeof openStageDialog !== 'boolean' ? openStageDialog : undefined}
                />
              )}
            </div>
          );
        }}
      />
      <Input
        className="fullwidth"
        label={t('comment')}
        theme="gray"
        multiline
        disabled={disabled}
        {...register('comment')}
      />
      {!!openScreaning && (
        <ScreaningDialog participation={watch()} open={openScreaning} onClose={() => void setOpenScreaning(false)} onSubmit={screaningSubmit} />
      )}
    </FormWrapper>
  );
};

export default OrderParticipationForm;
