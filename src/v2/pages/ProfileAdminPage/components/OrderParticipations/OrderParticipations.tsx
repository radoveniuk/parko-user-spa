import React from 'react';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import pick from 'lodash-es/pick';

import { useDeleteOrderParticipation, useUpdateOrderParticipation } from 'api/mutations/orderParticipationMutation';
import { IOrderParticipation } from 'interfaces/orderParticipation.interface';

import OrderParticipationCard from './OrderParticipationCard';

type Props = {
  data: IOrderParticipation<true>[];
}

const Employments = ({ data }: Props) => {
  const { id: userId } = useParams();
  const queryKey = ['orderParticipations', JSON.stringify({ user: userId })];
  const updateOrderParticipation = useUpdateOrderParticipation();
  const deleteOrderParticipation = useDeleteOrderParticipation();
  const queryClient = useQueryClient();

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
    </>
  );
};

export default Employments;
