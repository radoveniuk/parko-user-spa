import React from 'react';
import { useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';

import { useDeleteEmployment, useUpdateEmployment } from 'api/mutations/employmentMutation';
import { useGetClients } from 'api/query/clientQuery';
import { IEmployment } from 'interfaces/employment.interface';
import { IProject } from 'interfaces/project.interface';

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

  const renderEmployments = (list: typeof data) => list.map((item) => (
    <EmploymentCard
      key={item._id}
      data={item}
      onChange={(values) => {
        updateEmployment.mutate({ ...item, ...values });
      }}
      onDelete={() => {
        deleteEmployment.mutate(item._id);
        queryClient.setQueryData(
          ['employments', JSON.stringify({ user: userId })],
          data.filter((itemToDelete) => itemToDelete._id !== item._id),
        );
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
