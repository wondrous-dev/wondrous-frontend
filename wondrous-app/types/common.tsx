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

export enum ImageKeyEnums {
  headerPicture = 'headerPicture',
  profilePicture = 'profilePicture',
}

export enum ImageTypes {
  header = 'header',
  profile = 'profile',
}
