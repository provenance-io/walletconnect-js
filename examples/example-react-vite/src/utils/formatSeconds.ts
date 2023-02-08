export const formatSeconds = (seconds = 0, digits = 2) => {
  const secHour = 3600;
  const secMin = 60;
  let hours = 0;
  let mins = 0;
  let secs = 0;
  let remainder = seconds;

  // Get hours
  if (remainder >= secHour) {
    hours = Math.floor(remainder / secHour);
    remainder %= secHour;
  }
  // Check for mins
  if (remainder >= secMin) {
    mins = Math.floor(remainder / secMin);
    remainder %= secMin;
  }
  // Check for left over seconds
  secs = remainder;

  const leadZero = (value: number) => String(value).padStart(2, "0");
  // Return final time
  return `${leadZero(hours)}:${leadZero(mins)}:${leadZero(secs)}`;
};
