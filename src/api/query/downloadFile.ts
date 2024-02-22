import api, { openFile } from 'api/common';

const downloadFile = (id: string, name: string, ext = 'pdf') => api.get(`/files/download/${id}`, { responseType: 'blob' })
  .then((res) => {
    openFile(res.data, `${name}.${ext}`);
  });

export default downloadFile;
