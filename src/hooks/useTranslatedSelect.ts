import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const useTranslatedSelect = (values: string[], entity: string, isSelect = true, localeCompare = true) => {
  const { t } = useTranslation();
  const translatedItems = useMemo(() => values
    .map((option) => ({
      value: option,
      label: isSelect ? t(`selects.${entity}.${option}`) : t(`${entity}.${option}`),
    }))
  , [entity, isSelect, t, values]);

  if (localeCompare) return translatedItems.sort((a, b) => a.label.localeCompare(b.label));
  return translatedItems;
};

export default useTranslatedSelect;
