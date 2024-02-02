export const PROJECT_TYPES: Record<string, {label: string, value: string}> = {
  PodKmen: {
    label: 'Pod kmeň',
    value: 'Pod kmeň',
  },
  Outsourcing: {
    label: 'Outsourcing',
    value: 'Outsourcing',
  },
  Leasing: {
    label: 'Leasing',
    value: 'HR Service',
  },
};

export const getProjectType = (value?: string) => {
  if (!value) return undefined;
  let projectTypeData: {label: string, value: string} | undefined;
  for (const key in PROJECT_TYPES) {
    if (Object.prototype.hasOwnProperty.call(PROJECT_TYPES, key)) {
      const element = PROJECT_TYPES[key];
      if (element.value === value) {
        projectTypeData = element;
      }
    }
  }
  return projectTypeData;
};
