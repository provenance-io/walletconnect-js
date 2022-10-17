// Create a random set up numbers at the requested length
export var rngNum = function rngNum() {
  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;
  // Use Math.random to create a decimal number: 0.123123123123, then string and slice out the numbers
  var rngDecimalString = Math.random().toString(); // Slice and convert back to number to return

  return Number(rngDecimalString.slice(2, length + 2));
};