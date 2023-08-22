export const getFavicon = () => {
  // Get all link elements within the head section on the page
  const linkElementArray = Array.from(document.head.getElementsByTagName('link'));
  // Loop over each link and pull out the links with rel='icon' and an href url
  const faviconUrls = linkElementArray
    // Pull out all links with rel='icon' and an href url
    .filter(
      (linkElement) =>
        !!linkElement.rel && linkElement.rel.includes('icon') && !!linkElement.href
    )
    // Only put the icon url back into the array
    .map((linkElement) => linkElement.href);

  return faviconUrls;
};
