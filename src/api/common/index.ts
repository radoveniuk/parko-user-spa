import axios from 'axios';
import { IFile } from 'interfaces/file.interface';

// "proxy": "http://localhost:3000",

const api = axios.create({
  withCredentials: true,
});

export const uploadFiles = (formData: FormData): Promise<IFile[]> => fetch('/files', {
  method: 'POST',
  body: formData,
  redirect: 'follow',
})
  .then(response => response.json())
  .then(result => result.data);

export default api;
