import api from 'api/common';

type TranslateParams = {
  fromLang: string;
  text: string;
  toLang: string;
}

export const fetchTranslation = (params: TranslateParams) => api.get('/translate', { params }).then((res) => res.data.data.text);
