import api from 'api/common';

const downloadFile = (id: string, name: string, ext = 'pdf') => api.get(`/files/download/${id}`, { responseType: 'blob' })
  .then((res) => {
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${name}.${ext}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  });

export default downloadFile;
