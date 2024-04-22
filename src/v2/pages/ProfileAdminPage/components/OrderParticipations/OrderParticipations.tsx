import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import pick from 'lodash-es/pick';

import { useDeleteOrderParticipation, useUpdateOrderParticipation } from 'api/mutations/orderParticipationMutation';
import { IOrderParticipation } from 'interfaces/orderParticipation.interface';

import OrderParticipationCard from './OrderParticipationCard';
import RedirectDialog from './RedirectDialog';

type Props = {
  data: IOrderParticipation<true>[];
}

const Employments = ({ data }: Props) => {
  const { id: userId } = useParams();
  const queryKey = ['orderParticipations', JSON.stringify({ user: userId })];
  const updateOrderParticipation = useUpdateOrderParticipation();
  const deleteOrderParticipation = useDeleteOrderParticipation();
  const queryClient = useQueryClient();

  // redirect msg
  const [openRedirectMsg, setOpenRedirectMsg] = useState(false);

  const renderOrders = (list: typeof data) => list.map((item) => (
    <OrderParticipationCard
      key={item._id}
      data={item}
      onChange={(values) => {
        updateOrderParticipation.mutate({ _id: item._id, ...pick(values, ['screaning', 'stages', 'comment']) });
        queryClient.setQueryData(
          queryKey,
          data.map((itemToUpdate) => itemToUpdate._id === item._id ? { ...item, ...values } : itemToUpdate),
        );
        if (values.stages?.[values.stages?.length - 1].stage.staticName === 'hired') {
          setOpenRedirectMsg(true);
        }
      }}
      onDelete={() => {
        deleteOrderParticipation.mutate(item._id);
        queryClient.setQueryData(
          queryKey,
          data.filter((itemToDelete) => itemToDelete._id !== item._id),
        );
      }}
    />
  ));

  return (
    <>
      <div className="col">
        {renderOrders(data.toSpliced(Math.round(data.length / 2), data.length))}
      </div>
      <div className="col">
        {renderOrders(data.toSpliced(0, Math.round(data.length / 2)))}
      </div>
      {!!openRedirectMsg && (
        <RedirectDialog
          open={openRedirectMsg}
          onClose={() => void setOpenRedirectMsg(false)}
        />
      )}
    </>
  );
};

export default Employments;
