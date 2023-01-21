export type SlashCommandElement<Children> = {
  type: 'slashCommand';
  children: Children;
  command: string;
  action?: () => void;
  text?: undefined;
};
