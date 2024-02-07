import React from 'react';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';

import { useDeleteEmployment, useUpdateEmployment } from 'api/mutations/employmentMutation';
import { useGetClients } from 'api/query/clientQuery';
import { IEmployment } from 'interfaces/employment.interface';
import { IProject } from 'interfaces/project.interface';

import useUpdateCachedUserData from '../../hooks/useUpdateCachedUserData';

import EmploymentCard from './EmploymentCard';

type Props = {
  data: IEmployment[];
}

const Employments = ({ data }: Props) => {
  const { id: userId } = useParams();
  const updateEmployment = useUpdateEmployment();
  const deleteEmployment = useDeleteEmployment();
  const queryClient = useQueryClient();
  const projects = queryClient.getQueryData(['projects', JSON.stringify({})]) as IProject[];
  const { data: clients = [] } = useGetClients();
  const updateCachedUserData = useUpdateCachedUserData();

  const renderEmployments = (list: typeof data) => list.map((item) => (
    <EmploymentCard
      key={item._id}
      data={item}
      onChange={(values) => {
        updateEmployment.mutate({ _id: item._id, ...values });
        const otherEmployments = data.filter((employment) => employment._id !== item._id);
        if (values.status === 'hired') {
          updateCachedUserData({ status: 'hired' });
        }
        if (values.status === 'fired' && !otherEmployments.some((employment) => employment.status === 'hired')) {
          updateCachedUserData({ status: 'fired' });
        }
        if (values.status === 'canceled' && !otherEmployments.some((employment) => employment.status === 'hired')) {
          updateCachedUserData({ status: 'candidate' });
        }
      }}
      onDelete={() => {
        deleteEmployment.mutate(item._id);
        queryClient.setQueryData(
          ['employments', JSON.stringify({ user: userId })],
          data.filter((itemToDelete) => itemToDelete._id !== item._id),
        );
        const otherEmployments = data.filter((employment) => employment._id !== item._id);
        if (otherEmployments.some((employment) => employment.status === 'hired')) {
          updateCachedUserData({ status: 'hired' });
        } else if (otherEmployments.some((employment) => employment.status === 'fired')) {
          updateCachedUserData({ status: 'fired' });
        } else {
          updateCachedUserData({ status: 'candidate' });
        }
      }}
      projects={projects}
      clients={clients}
    />
  ));

  return (
    <>
      <div className="col">
        {renderEmployments(data.toSpliced(Math.round(data.length / 2), data.length))}
      </div>
      <div className="col">
        {renderEmployments(data.toSpliced(0, Math.round(data.length / 2)))}
      </div>
    </>
  );
};

export default Employments;
