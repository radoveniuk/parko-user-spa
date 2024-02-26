import api, { openFile, saveFile } from 'api/common';

const downloadFile =
(id: string, name: string, ext = 'pdf', action: 'open' | 'save' = 'open') => api.get(`/files/download/${id}`, { responseType: 'blob' })
  .then((res) => {
    action === 'open'
      ? openFile(res.data, `${name}.${ext}`)
      : saveFile(res.data, `${name}.${ext}`);
  });

export default downloadFile;
