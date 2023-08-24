import { getFavicon } from './getFavicon';

export const getPageData = () => {
  const origin = window.location.origin;
  const favicon = getFavicon();
  const title = window.document.title;
  return { origin, favicon, title };
};
