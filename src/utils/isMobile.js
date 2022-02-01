// Best guess if the current browser is a mobile device
export const isMobile = () => {
  // Test the user agent if it exists
  let isMobileUserAgent = true;
  const { userAgent } = navigator;
  if (userAgent) isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  // Test the screen size
  const isMobileScreenSize = window.matchMedia("only screen and (max-width: 760px)").matches;
  // Test touchevents
  const isMobileTouchEvent = 'ontouchstart' in document.documentElement;

  // Combine tests and return result, all must pass to be mobile device
  return (isMobileUserAgent && isMobileScreenSize && isMobileTouchEvent);
};
