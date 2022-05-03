export const getIcon = (icon) => {
  // To get icon from Notion
  if (icon.type === 'emoji') {
    return <span>{icon.emoji}</span>;
  }
  if (icon.type === 'file') {
    return <img src={icon.file.url} alt="icon" />;
  }
  // To get favicon from url
  return <img src={`https://s2.googleusercontent.com/s2/favicons?domain=${icon}`} alt="icon" />;
};
