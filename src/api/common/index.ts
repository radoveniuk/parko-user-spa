import axios from 'axios';
import { IFile } from 'interfaces/file.interface';

const baseURL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export const uploadFiles = (formData: FormData): Promise<IFile[]> => fetch(`${baseURL}/files`, {
  method: 'POST',
  body: formData,
  redirect: 'follow',
})
  .then(response => response.json())
  .then(result => result.data);

export default api;
