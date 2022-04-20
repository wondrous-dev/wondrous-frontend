export type Role = {
  id: string;
  name: string;
  default: boolean;
  permissions: string[];
};

export enum ViewType {
  List = 'list',
  Grid = 'grid',
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
