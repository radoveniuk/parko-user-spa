import { useQuery } from 'react-query';

import api from 'api/common';
import { ICustomFormField, ICustomFormSection } from 'interfaces/form.interface';
import { QueryOptions } from 'interfaces/query.types';

const PATH = '/custom-form';

export const useGetCustomFormFields = (params: Partial<ICustomFormField> = {}, options?: QueryOptions) => useQuery<ICustomFormField[]>(
  ['customFormFields', JSON.stringify(params)],
  () => api.get(`${PATH}/fields`, { params }).then((res) => res.data.data),
  {
    initialData: [],
    refetchOnWindowFocus: false,
    ...options,
  },
);

export const useGetCustomFormSections = (params: Partial<ICustomFormSection>, options?: QueryOptions) => useQuery<ICustomFormSection[]>(
  ['customFormSections', JSON.stringify(params)],
  () => api.get(`${PATH}/sections`, { params }).then((res) => res.data.data),
  {
    initialData: [],
    refetchOnWindowFocus: false,
    ...options,
  },
);
