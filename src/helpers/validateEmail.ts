import i18n from 'i18next';
export const validateEmail = (email:string):boolean | string => /\S+@\S+\.\S+/.test(email) || i18n.t('user.mailError') as string;
