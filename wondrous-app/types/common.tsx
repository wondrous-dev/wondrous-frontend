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
