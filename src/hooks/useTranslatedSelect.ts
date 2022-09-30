import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const useTranslatedSelect = (values: string[], entity?: string, isSelect = true, localeCompare = true) => {
  const { t } = useTranslation();

  const getLabel = useCallback((option: string) => {
    if (entity) {
      return isSelect ? t(`selects.${entity}.${option}`) : t(`${entity}.${option}`);
    }
    return t(option);
  }, [entity, isSelect, t]);

  const translatedItems = useMemo(() => values
    .map((option) => ({
      value: option,
      label: getLabel(option),
    }))
  , [getLabel, values]);

  if (localeCompare) return translatedItems.sort((a, b) => a.label.localeCompare(b.label));
  return translatedItems;
};

export default useTranslatedSelect;
