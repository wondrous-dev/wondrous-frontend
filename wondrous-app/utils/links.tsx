type Link = {
  displayName: string;
  url: string;
  type: string;
};

export const formatLinkDisplay = (link: Link) => {
  if (!link || !link.url) {
    return '';
  }
  return link.displayName || link.url.replace('http://', '').substring(0, 20);
};
