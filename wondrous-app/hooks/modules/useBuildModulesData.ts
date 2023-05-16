import { SmallDao2DaoIcon } from 'components/Icons/Dao2Dao';
import GrantIcon from 'components/Icons/GrantIcon';
import CheckBoxIcon from 'components/Icons/Sidebar/checkBox.svg';
import ContentPaste from 'components/Icons/Sidebar/contentPaste.svg';
import FlagIcon from 'components/Icons/Sidebar/flag.svg';
import FolderIcon from 'components/Icons/Sidebar/folder.svg';
import PieChartIcon from 'components/Icons/Sidebar/pieChart.svg';
import PodIcon from 'components/Icons/Sidebar/pods.svg';
import StartIcon from 'components/Icons/Sidebar/star.svg';
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
      Icon: PodIcon,
      count: count?.podCount,
    },
    [ENTITIES_TYPES.TASK]: {
      active: modules?.task,
      Icon: CheckBoxIcon,
      count: count?.taskCount,
    },
    [ENTITIES_TYPES.BOUNTY]: {
      active: modules?.bounty,
      Icon: StartIcon,
      count: count?.bountyCount,
    },
    [ENTITIES_TYPES.MILESTONE]: {
      active: modules?.milestone,
      Icon: FlagIcon,
      count: count?.milestoneCount,
    },
    [ENTITIES_TYPES.PROPOSAL]: {
      active: modules?.proposal,
      Icon: ContentPaste,
      count: count?.proposalCount,
    },
    [ENTITIES_TYPES.GRANT]: {
      active: modules?.grant,
      Icon: GrantIcon,
      count: count?.grantCount,
    },

    [ENTITIES_TYPES.COLLAB]: {
      active: modules?.collab,
      Icon: SmallDao2DaoIcon,
      count: count?.collabCount,
    },
    document: {
      active: modules?.document,
      Icon: FolderIcon,
      count: count?.documentCount,
    },
    leaderboard: {
      active: modules?.leaderboard,
      Icon: PieChartIcon,
      count: count?.leaderboardCount,
    },
  };
  return data;
};

export default useBuildModulesData;
