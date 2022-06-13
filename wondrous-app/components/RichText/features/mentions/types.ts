export type MentionElement<Children> = {
  type: 'mention';
  children: Children;
  mentionable: string;
  id: string;
  text?: undefined;
};
