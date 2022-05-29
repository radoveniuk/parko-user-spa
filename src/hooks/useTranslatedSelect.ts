import { useTranslation } from 'react-i18next';

const useTranslatedSelect = (values: string[], select: string) => {
  const { t } = useTranslation();
  return values.map((option) => ({
    value: option,
    label: t(`selects.${select}.${option}`),
  }));
};

export default useTranslatedSelect;
