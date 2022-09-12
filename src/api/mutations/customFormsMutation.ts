import { useMutation } from 'react-query';

import api from 'api/common';
import { ICustomFormField, ICustomFormSection } from 'interfaces/form.interface';

const PATH = '/custom-form';

export const useCreateCustomFormFieldMutation = () => {
  const request = (data: ICustomFormField) => api.post(`${PATH}/fields`, data).then(res => res.data.data);
  return useMutation(request);
};

export const useCreateCustomFormSectionMutation = () => {
  const request = (data: ICustomFormSection) => api.post(`${PATH}/sections`, data).then(res => res.data.data);
  return useMutation(request);
};
