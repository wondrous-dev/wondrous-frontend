export type Role = {
  id: string;
  name: string;
  default: boolean;
  permissions: string[];
  tokenGatingCondition: any;
  discordRolesInfo: any[];
};

export enum ViewType {
  List = 'list',
  Grid = 'grid',
  Calendar = 'calendar',
  Admin = 'admin',
}

export interface Link {
  displayName: string;
  url: string;
  type: string;
}

export enum SettingsPage {
  Profile,
  Org,
  Pod,
}
