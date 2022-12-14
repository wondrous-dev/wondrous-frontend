import { DefaultUserImage } from 'components/Common/Image';
import { DAOIcon } from 'components/Icons/dao';
import PodIcon from 'components/Icons/podIcon';
import { CheckedBox } from 'components/SearchSuggestions/styles';
import { GLOBAL_SEARCH_TYPES } from 'utils/constants';

export const SUGGESTIONS = [
  {
    label: "Tasks I've created",
    Icon: CheckedBox,
    key: 'user-created-tasks',
  },
];

export const initialState = {
  cursors: {
    parent: 0,
    child: 0,
  },
  options: {},
  isLoading: false,
};

export const TYPES = {
  SET_CURSORS: 'SET_CURSORS',
  SET_OPTIONS: 'SET_OPTIONS',
  SET_LOADING: 'SET_LOADING',
  HOVER_SET_CURSORS: 'HOVER_SET_CURSORS',
};

export enum DIRECTION {
  UP = 'UP',
  DOWN = 'DOWN',
}

export interface Labels {
  label: string;
  defaultImg: any;
}

export const LABELS_DEFAULT_IMAGES_MAP = {
  [GLOBAL_SEARCH_TYPES.ORGS]: {
    label: 'Organizations',
    defaultImg: () => <DAOIcon />,
  },
  [GLOBAL_SEARCH_TYPES.PODS]: {
    label: 'Pods',
    defaultImg: () => <PodIcon />,
  },
  [GLOBAL_SEARCH_TYPES.USERS]: {
    label: 'Users',
    defaultImg: () => <DefaultUserImage />,
  },
};
