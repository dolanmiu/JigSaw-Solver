export const splitToNChunks = <T>(array: T[], n: number): T[][] => {
  let result = [];
  for (let i = n; i > 0; i--) {
    result.push(array.splice(0, Math.ceil(array.length / i)));
  }
  return result;
};
