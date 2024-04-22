import React, { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import OrderFormDialog from 'v2/components/OrderFormDialog';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { useUpdateOrder } from 'api/mutations/orderMutation';
import { EditIcon } from 'components/icons';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { IClient } from 'interfaces/client.interface';
import { ICustomForm } from 'interfaces/form.interface';
import { IOrder } from 'interfaces/order.interface';
import { IOrderParticipation } from 'interfaces/orderParticipation.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';

import { ProfileCardWrapper } from './styles';

export type ClientCardProps = {
  data: IOrder<true>;
  participations: IOrderParticipation<true>[];
};

const OrderCard = ({ data, participations }: ClientCardProps) => {
  const { t } = useTranslation();
  const { role } = useAuthData();

  const [isOpenForm, setIsOpenForm] = useState(false);

  const closeForm = () => void setIsOpenForm(false);

  const [order, setOrder] = useState(data);
  const managers = order.managers as IUser[] | null;

  const updateOrder = useUpdateOrder();

  const queryClient = useQueryClient();

  const renderManagers = () => managers
    ?.map((item) => {
      if (typeof item === 'string') {
        const managerUsers = queryClient.getQueryData(['users', JSON.stringify({ roles: 'recruiter,admin' })]) as IUser[];
        const manager = managerUsers.find((user) => user._id === item);
        return `${manager?.fullname}`;
      }
      return `${item.fullname}`;
    })
    .join(' / ');

  const stats = useMemo(() => {
    const hired = participations.filter((item) => item.stages[item.stages.length - 1]?.stage.staticName === 'hired').length;
    const canceled = participations.filter((item) => item.stages[item.stages.length - 1]?.stage.staticName === 'canceled').length;
    const candidates = participations.length - hired - canceled;
    const left = order.goal - hired;
    return {
      hired, canceled, candidates, left,
    };
  }, [order.goal, participations]);

  return (
    <>
      <ProfileCardWrapper>
        <IconButton className="edit-profile-btn" onClick={() => void setIsOpenForm(true)}><EditIcon /></IconButton>
        <div className="contacts-info section">
          <div className="name">{order.name}</div>
          <div className="contacts">
            {!!order.client && <div className="contact-text-link">{order.client.shortName}</div>}
            {!!order.project && <div className="contact-text-link">{order.project.name}</div>}
            {!!order.status && <StatusLabel className={order.status}>{t(`selects.orderStatus.${order.status}`)}</StatusLabel>}
          </div>
        </div>
        <div className="common section">
          {!!order.specificationUrl && (
            <a href={order.specificationUrl} className="info-item" target="_blank" rel="noreferrer">{t('order.specificationUrl')}</a>
          )}
          <div className="info-item"><div className="name">{t('order.positionName')}:{' '}</div>
            {order.project.positions?.find(position => position.matterId === order.positionId)?.internalName}
          </div>
          <div className="info-item">
            <div className="name">{t('order.cooperationType')}:</div> {t(`selects.orderCooperationType.${order.cooperationType}`)}
          </div>
          <div className="info-item"><div className="name">{t('order.salary')}:</div> {order.salary}</div>
          <div className="info-item"><div className="name">{t('order.location')}:</div> {order.location}</div>
          <div className="info-item"><div className="name">{t('order.variability')}:</div> {order.variability}</div>
          <div className="info-item"><div className="name">{t('order.managers')}:</div> {renderManagers()}</div>
          <div className="info-item">
            <div className="name">{t('order.dateFrom')} - {t('order.dateTo')}:</div> {getDateFromIso(order.dateFrom)} - {getDateFromIso(order.dateTo)}
          </div>
          <div className="info-item"><div className="name">{t('comment')}:</div> {order.comment}</div>
        </div>
        <div className="stats section">
          <div className="label">{t('order.stats')}</div>
          <div className="info-item"><div className="name">{t('order.goal')}:</div> {order.goal}</div>
          <div className="info-item"><div className="name">{t('order.employed')}:</div> {stats.hired}</div>
          <div className="info-item"><div className="name">{t('order.left')}:</div> {stats.left}</div>
          <div className="info-item"><div className="name">{t('order.candidates')}:</div> {stats.candidates}</div>
          <div className="info-item"><div className="name">{t('order.canceled')}:</div> {stats.canceled}</div>
        </div>
        <div className="system-info section">
          <div className="system-info-item">{t('user.lastUpdate')}: {getDateFromIso(order.updatedAt)}</div>
          <div className="system-info-item">{t('user.createdAt')}: {getDateFromIso(order.createdAt)}</div>
        </div>
      </ProfileCardWrapper>
      {!!isOpenForm && (
        <OrderFormDialog
          open={isOpenForm}
          onClose={closeForm}
          onSave={(values: Partial<IOrder>) => {
            closeForm();
            updateOrder.mutate({ _id: data._id, ...values });
            const allManagers = (queryClient.getQueryData(['users', JSON.stringify({ roles: 'recruiter,admin' })]) || []) as IUser[];
            const allClients = (queryClient.getQueryData(['clients', JSON.stringify({})]) || []) as IClient[];
            const allProjects = (queryClient.getQueryData(['projects', JSON.stringify({})]) || []) as IProject[];
            const allCustomForms = (queryClient.getQueryData(['customForms', JSON.stringify({})]) || []) as ICustomForm[];

            setOrder((prev) => ({
              ...prev,
              ...values,
              managers: allManagers?.filter((item) => (values.managers as string[])?.includes(item._id)),
              client: allClients.find(client => client._id === values.client) as IClient,
              project: allProjects.find(project => project._id === values.project) as IProject,
              form: allCustomForms.find(form => form._id === values.form) as ICustomForm,
              createdBy: prev.createdBy,
            }));
          }}
          data={order}
        />
      )}
    </>
  );
};

export default memo(OrderCard);
