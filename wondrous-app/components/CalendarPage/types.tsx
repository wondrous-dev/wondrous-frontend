import { TaskFilter } from 'types/task';
import { ENTITIES_TYPES } from 'utils/constants';

export type CalendarTaskFilter = TaskFilter & {
  types: Array<typeof ENTITIES_TYPES[keyof typeof ENTITIES_TYPES]>;
};

export enum CalendarProvidedIn {
  ORGANIZATION = 'organization',
  POD = 'pod',
}