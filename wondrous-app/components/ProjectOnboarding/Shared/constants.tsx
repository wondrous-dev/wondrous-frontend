import ProjectCreateForm from '../ProjectCreate';
import BasicsSetup from '../BasicsSetup';
import Community from '../Community';
import GuidesPage from '../GuidesPage';
import PostCreate from '../ProjectCreate/PostCreate';
import Summary from '../Summary';
import Workflow from '../Workflow';

export const TYPES = {
  BASICS: 'basics',
  GUIDES: 'guides',
  WORKFLOW: 'workflow',
  COMMUNITY: 'community',
  SUMMARY: 'summary',
};

export const FEATURES_TYPES = {
  TWITTER: 'twitter',
  DISCORD: 'discord',
};
export const CONFIG = [
  {
    Component: ProjectCreateForm,
  },
  {
    Component: PostCreate,
  },
  {
    Component: GuidesPage,
    type: TYPES.GUIDES,
  },
  {
    type: TYPES.BASICS,
    Component: BasicsSetup,
  },
  {
    type: TYPES.WORKFLOW,
    Component: Workflow,
  },
  {
    type: TYPES.COMMUNITY,
    Component: Community,
  },
  {
    type: TYPES.SUMMARY,
    Component: Summary,
  },
];

export const FEATURES = {
  [FEATURES_TYPES.TWITTER]: [
    'Autofill your profile',
    'Enable DMs in your profile for networking',
    'Provide a verification badge',
  ],
  [FEATURES_TYPES.DISCORD]: ['Receive notifications', 'Manage roles'],
};
