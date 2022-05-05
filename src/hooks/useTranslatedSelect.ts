import { useTranslation } from 'react-i18next';

const useTranslatedSelect = (values: string[]) => {
  const { t } = useTranslation();
  return values.map((option) => ({
    value: option,
    label: t(`selects.${option}`),
  }));
};

export default useTranslatedSelect;
