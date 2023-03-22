import { ProjectCreateForm } from '..';
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
    LeftPanel: Workflow.LeftPanel,
    RightPanel: Workflow.RightPanel,
  },
  {
    type: TYPES.COMMUNITY,
    LeftPanel: Community.LeftPanel,
    RightPanel: Community.RightPanel,
  },
  {
    type: TYPES.SUMMARY,
    RightPanel: Summary,
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
