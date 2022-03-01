type Link = {
  displayName: string;
  url: string;
  type: string;
};

export const formatLinkDisplay = (link: Link) => {
  if (!link || !link.url) {
    return '';
  }
  return link.displayName || link.url.replace(/https?:\/{2}(w{3}.)?/, '');
};
