export const iterateMap = <T>(iterations: number, callback: (index: number) => T) => {
  if (typeof iterations !== 'number') return null;
  const output: T[] = [];
  for (let i = 0; i < iterations; i += 1) {
    const element = callback(i);
    output.push(element);
  }
  return output;
};
