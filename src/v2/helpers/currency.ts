export const getCurrencyString = (value: string | number | undefined, currency = '€') => value ? `${Number(value).toFixed(2).replace('.', ',')} ${currency}` : '';
