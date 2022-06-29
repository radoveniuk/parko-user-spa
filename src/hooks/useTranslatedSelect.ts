import { useTranslation } from 'react-i18next';

const useTranslatedSelect = (values: string[], entity: string, isSelect = true) => {
  const { t } = useTranslation();
  return values.map((option) => ({
    value: option,
    label: isSelect ? t(`selects.${entity}.${option}`) : t(`${entity}.${option}`),
  }));
};

export default useTranslatedSelect;
