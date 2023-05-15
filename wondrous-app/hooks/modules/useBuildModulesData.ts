import CheckBoxIcon from 'components/Icons/Sidebar/checkBox.svg';
import { ENTITIES_TYPES } from 'utils/constants';
import useQueryGetTasksPerTypeCount from './useQueryGetTasksPerTypeCount';
import useQueryModules from './useQueryModules';

const useBuildModulesData = ({ orgId = '', podId = '', orgUsername = '' }) => {
  const modules = useQueryModules({ orgId, orgUsername, podId });
  const count = useQueryGetTasksPerTypeCount({ orgId, podId });
  if (!modules || !count) return null;
  const data = {
    [ENTITIES_TYPES.POD]: {
      active: modules?.pod,
      ModuleIcon: CheckBoxIcon,
      count: count?.podCount,
    },
    [ENTITIES_TYPES.TASK]: {
      active: modules?.task,
      ModuleIcon: CheckBoxIcon,
      count: count?.taskCount,
    },
    [ENTITIES_TYPES.BOUNTY]: {
      active: modules?.bounty,
      ModuleIcon: CheckBoxIcon,
      count: count?.bountyCount,
    },
    [ENTITIES_TYPES.MILESTONE]: {
      active: modules?.milestone,
      ModuleIcon: CheckBoxIcon,
      count: count?.milestoneCount,
    },
    [ENTITIES_TYPES.PROPOSAL]: {
      active: modules?.proposal,
      ModuleIcon: CheckBoxIcon,
      count: count?.proposalCount,
    },
    [ENTITIES_TYPES.GRANT]: {
      active: modules?.grant,
      ModuleIcon: CheckBoxIcon,
      count: count?.grantCount,
    },

    [ENTITIES_TYPES.COLLAB]: {
      active: modules?.collab,
      ModuleIcon: CheckBoxIcon,
      count: count?.collabCount,
    },
    document: {
      active: modules?.document,
      ModuleIcon: CheckBoxIcon,
      count: count?.documentCount,
    },
    leaderboard: {
      active: modules?.leaderboard,
      ModuleIcon: CheckBoxIcon,
      count: count?.leaderboardCount,
    },
  };
  return data;
};

export default useBuildModulesData;
