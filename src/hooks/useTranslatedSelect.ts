import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const useTranslatedSelect = (values: string[], entity: string, isSelect = true, localeCompare = false) => {
  const { t } = useTranslation();
  const translatedItems = useMemo(() => values
    .map((option) => ({
      value: option,
      label: isSelect ? t(`selects.${entity}.${option}`) : t(`${entity}.${option}`),
    }))
    .sort((a, b) => a.label.localeCompare(b.label)), [entity, isSelect, t, values]);
  return translatedItems;
};

export default useTranslatedSelect;
