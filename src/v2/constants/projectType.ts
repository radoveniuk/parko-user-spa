export const PROJECT_TYPES: Record<string, {label: string, value: string}> = {
  Mediation: {
    label: 'Mediation',
    value: 'Mediation',
  },
  Outsourcing: {
    label: 'Outsourcing',
    value: 'Outsourcing',
  },
  Leasing: {
    label: 'Leasing',
    value: 'Leasing',
  },
};

export const getProjectType = (value?: string) => {
  if (!value) return undefined;
  let projectTypeData: {label: string, value: string, key: string} | undefined;
  for (const key in PROJECT_TYPES) {
    if (Object.prototype.hasOwnProperty.call(PROJECT_TYPES, key)) {
      const element = PROJECT_TYPES[key];
      if (element.value === value) {
        projectTypeData = { ...element, key };
      }
    }
  }
  return projectTypeData;
};
