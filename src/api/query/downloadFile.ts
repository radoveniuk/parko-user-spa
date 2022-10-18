import api, { saveFile } from 'api/common';

const downloadFile = (id: string, name: string, ext = 'pdf') => api.get(`/files/download/${id}`, { responseType: 'blob' })
  .then((res) => {
    saveFile(res.data, `${name}.${ext}`);
  });

export default downloadFile;
