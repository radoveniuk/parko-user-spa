export const generateDateCheckbox = (array: string, name: string) => {
  const valueArray = array.length ? array.split(',') : [];
  valueArray.includes(name)
    ? valueArray.splice(valueArray.indexOf(name), 1)
    : valueArray.push(name);

  return valueArray.join(',');
};
