import axios from 'axios';

import { IFile } from 'interfaces/file.interface';

export const BASE_URL = '/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const uploadFiles = (formData: FormData): Promise<IFile[]> => fetch(`${BASE_URL}/files`, {
  method: 'POST',
  body: formData,
  redirect: 'follow',
})
  .then(response => response.json())
  .then(result => result.data);

export const saveFile = (file: any, name: string) => {
  const url = window.URL.createObjectURL(new Blob([file]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export default api;
