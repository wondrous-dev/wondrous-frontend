import { ENTITIES_TYPES } from 'utils/constants';

export type EntitiesType = typeof ENTITIES_TYPES[keyof typeof ENTITIES_TYPES] | null;
