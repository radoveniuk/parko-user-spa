import axios from 'axios';

import { IFile } from 'interfaces/file.interface';

export const BASE_URL = process.env.REACT_APP_API_URL as string;

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

export default api;
