export const sizes = {
  xl: 1920, // [ 1920px - ∞ ]
  lg: 1280, // [ 1280px - 1919px ]
  md: 960, // [ 960px - 1279px ]
  sm: 600, // [ 600 - 959px ]
  xs: 0, // [ 0 - 599px ]
};

// Exact size and above/greater, eg: 960 - ∞
const up = (size) => `(min-width: ${sizes[size]}px)`;
// Exact size and below/less, eg: 1280 - 0 px
const down = (size) => `(max-width: ${sizes[size]}px)`;
// Exactly one size, eg: 600px
const only = (size) => `(min-width: ${sizes[size]}px) and (max-width: ${sizes[size]}px)`;
// Between two sizes, eg: 600px-1280px
const between = (min, max) => `(min-width: ${sizes[min]}px) and (max-width: ${sizes[max] - 1}px)`;

export const breakpoints = {
  up,
  down,
  only,
  between,
};