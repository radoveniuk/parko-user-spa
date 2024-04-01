import React, { useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button, Input, Menu, MenuItem } from 'v2/uikit';
import IconButton from 'v2/uikit/IconButton';

import { DeleteIcon, EditIcon, EyeIcon, EyeSlashIcon, PlusIcon, ThreeDotsIcon } from 'components/icons';
import { EXPIRIENCE_METHOD_OPTIONS } from 'constants/selectsOptions';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { ICustomFormField } from 'interfaces/form.interface';
import { IOrderParticipation, IOrderParticipationStage } from 'interfaces/orderParticipation.interface';
import { themeConfig } from 'theme';

import ScreaningDialog from '../ScreaningDialog';

import StageDialog from './StageDialog';
import { FormWrapper, InfoWrapper, ReadonlyExpirience, StagesTable } from './styles';

type Props = {
  disabled?: boolean;
};

const OrderParticipationForm = ({ disabled }: Props) => {
  const { t, i18n } = useTranslation();
  const { username } = useAuthData();
  const { control, watch, setValue, register } = useFormContext<IOrderParticipation<true>>();
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
    return `${completedRequirderFieldsCount} / ${requiredFieldsIds.length} (${(requiredFieldsIds.length ? completedRequirderFieldsCount / requiredFieldsIds.length : 1) * 100}%)`;
  }, [order.form?.requiredFields, screaning]);

  const renderCustomFieldValue = (id: string) => {
    const fieldData = order.form?.fields.find((field) => (field as ICustomFormField)._id === id) as ICustomFormField | undefined;

    if (['string', 'email', 'number', 'phone', 'select'].includes(fieldData?.type as string)) {
      return <>{fieldData?.names[i18n.language]}: {screaning[id]}</>;
    }

    if (fieldData?.type === 'multiselect') {
      return <>{fieldData?.names[i18n.language]}: {screaning[id]?.map((item: { label: string; }) => item.label).join(', ')}</>;
    }

    if (fieldData?.type === 'expirience') {
      return (
        <>
          {screaning[id]?.map((
            item: { matterId: string; company: string; dates: string; position: string; fireMethod: string, fireReason: string }, index: number,
          ) => (
            <ReadonlyExpirience key={item.matterId}>
              <div className="title">
                {index + 1}.
                <div className="company">{t('workExpirience.company')}: {item.company}</div>
              </div>
              <ul className="data">
                <li>{t('workExpirience.dates')}: {item.dates}</li>
                <li>{t('workExpirience.position')}: {item.position}</li>
                <li>{t('workExpirience.fireMethod')}: {EXPIRIENCE_METHOD_OPTIONS.find(option => option.value === item.fireMethod)?.label}</li>
                <li>{t('workExpirience.fireReason')}: {item.fireReason}</li>
              </ul>
            </ReadonlyExpirience>
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
          <div className="row">{t('order.client')}: {order.client.name}</div>
          <div className="row">{t('order.project')}: {order.project.name}</div>
          <div className="row">{t('order.status')}: {t(`selects.clientStatus.${order.status}`)}</div>
          <div className="row">{t('order.positionName')}: {order.positionName}</div>
          <div className="row">{t('order.cooperationType')}: {t(`selects.orderCooperationType.${order.cooperationType}`)}</div>
          <div className="row">{t('order.salary')}: {order.salary}</div>
          <div className="row">{t('order.location')}: {order.location}</div>
          <div className="row">{t('order.variability')}: {order.variability}</div>
          <div className="row">{t('order.managers')}: {order.managers?.map((item) => `${item.fullname}`).join(', ')}</div>
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
                            <EditIcon style={{ marginRight: 6 }} />{t('edit')}
                          </MenuItem>
                          <MenuItem onClick={() => void field.onChange(field.value.filter(item => item.stage.name !== stageItem.stage.name))}>
                            <DeleteIcon style={{ marginRight: 6 }} />{t('delete')}
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
