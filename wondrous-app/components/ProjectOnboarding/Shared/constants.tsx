import { ProjectCreateForm } from '..';
import BasicsSetup from '../BasicsSetup';
import GuidesPage from '../GuidesPage';
import PostCreate from '../ProjectCreate/PostCreate';

export const TYPES = {
  BASICS: 'basics',
  GUIDES: 'guides',
  WORKFLOW: 'workflow',
  COMMUNITY: 'community',
};

export const FEATURES_TYPES = {
  TWITTER: 'twitter',
};
export const CONFIG = [
  {
    LeftPanel: ProjectCreateForm.LeftPanel,
    RightPanel: ProjectCreateForm.RightPanel,
  },
  {
    RightPanel: PostCreate,
  },
  {
    LeftPanel: GuidesPage.LeftPanel,
    RightPanel: GuidesPage.RightPanel,
    type: TYPES.GUIDES,
  },
  {
    type: TYPES.BASICS,
    LeftPanel: BasicsSetup.LeftPanel,
    RightPanel: BasicsSetup.RightPanel,
  },
  {
    type: TYPES.WORKFLOW,
  },
  {
    type: TYPES.COMMUNITY,
  },
];

export const FEATURES = {
  [FEATURES_TYPES.TWITTER]: [
    'Autofill your profile',
    'Enable DMs in your profile for networking',
    'Provide a verification badge',
  ],
};
