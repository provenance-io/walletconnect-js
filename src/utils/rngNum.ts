// Create a random set up numbers at the requested length
export const rngNum = (length = 16): number => {
  // Use Math.random to create a decimal number: 0.123123123123, then string and slice out the numbers
  const rngDecimalString = Math.random().toString();
  // Slice and convert back to number to return
  return Number(rngDecimalString.slice(2, length + 2));
};
