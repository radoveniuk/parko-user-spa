import axios from 'axios';
import { IFile } from 'interfaces/file.interface';

const baseURL = 'http://localhost:3000';
// const baseURL = 'http://31.131.20.202:3000';

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
