import React from 'react';

import { useGetEmployments } from 'api/query/employmentQuery';

import { EmploymentsWrapper } from './styles';

const Employments = () => {
  const { data: employments } = useGetEmployments();
  return (
    <EmploymentsWrapper>
      {employments?.map((employment) => employment._id)}
    </EmploymentsWrapper>
  );
};

export default Employments;
