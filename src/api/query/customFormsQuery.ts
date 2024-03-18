import { useQuery } from 'react-query';

import api from 'api/common';
import { AnyObject } from 'interfaces/base.types';
import { ICustomForm, ICustomFormField, ICustomFormSection } from 'interfaces/form.interface';
import { QueryOptions } from 'interfaces/query.types';

const PATH = '/custom-form';

export const useGetCustomFormFields = (params: AnyObject = {}, options?: QueryOptions) => useQuery<ICustomFormField[]>(
  ['customFormFields', JSON.stringify(params)],
  () => api.get(`${PATH}/fields`, { params }).then((res) => res.data.data),
  {
    initialData: [],
    refetchOnWindowFocus: false,
    ...options,
  },
);

export const useGetCustomFormSections = (params: Partial<ICustomFormSection> = {}, options?: QueryOptions) => useQuery<ICustomFormSection[]>(
  ['customFormSections', JSON.stringify(params)],
  () => api.get(`${PATH}/sections`, { params }).then((res) => res.data.data),
  {
    initialData: [],
    refetchOnWindowFocus: false,
    ...options,
  },
);

export const useGetCustomForms = (params: Partial<ICustomForm> = {}, options?: QueryOptions) => useQuery<ICustomForm[]>(
  ['customForms', JSON.stringify(params)],
  () => api.get(`${PATH}/forms`, { params }).then((res) => res.data.data),
  {
    initialData: [],
    refetchOnWindowFocus: false,
    ...options,
  },
);
