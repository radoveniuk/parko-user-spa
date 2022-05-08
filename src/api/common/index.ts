import axios from 'axios';

const baseURL = 'http://localhost:3000';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export const uploadFiles = (formData: FormData) =>
// const formData = new window.FormData();

// files.forEach((file) => {
//   formData.append('files', file);
// });

  fetch(`${baseURL}/files`, {
    method: 'POST',
    body: formData,
    redirect: 'follow',
  })
    .then(response => response.json())
    .then(result => result.data)
;

export default api;
