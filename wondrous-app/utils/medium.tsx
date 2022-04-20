export const getIcon = (icon) => {
  if (icon.type === 'emoji') {
    return <span>{icon.emoji}</span>;
  }
  if (icon.type === 'file') {
    return <img src={icon.file.url} alt="icon" />;
  }
};
