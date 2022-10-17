// Best guess if the current browser is a mobile device
export var isMobile = function isMobile() {
  // Test the user agent if it exists
  var isMobileUserAgent = true;
  var _navigator = navigator,
      userAgent = _navigator.userAgent;
  if (userAgent) isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent); // Test the screen size

  var isMobileScreenSize = window.matchMedia("only screen and (max-width: 760px)").matches; // Test touchevents

  var isMobileTouchEvent = ('ontouchstart' in document.documentElement); // Combine tests and return result, all must pass to be mobile device

  return isMobileUserAgent && isMobileScreenSize && isMobileTouchEvent;
};