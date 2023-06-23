// Instead of console logs, use log function to post messages to console for debugging.
// dApps can enable/disable this logging feature when initializing the provider, default is "off"
// When off, won't do anything.
export const log = (loggingEnabled: boolean, message: string, data?: any) => {
  const consoleStyle =
    'background-color: white; color: #444444; font-weight: bold; font-size: 10px; border: 3px solid #444444;';

  if (loggingEnabled) {
    console.log(`%cWCJS LOG: ${message}`, consoleStyle, data);
  }
};
