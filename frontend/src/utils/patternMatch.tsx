const PatterMatch = (value: string, pattern: RegExp) => {
  let regex = pattern;
  return regex.test(value);
};
export default PatterMatch;
