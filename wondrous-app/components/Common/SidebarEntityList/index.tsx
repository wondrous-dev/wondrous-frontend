import { useQuery } from '@apollo/client';
import { SmallDao2DaoIcon } from 'components/Icons/Dao2Dao';
import GrantIcon from 'components/Icons/GrantIcon';
import HomeIcon from 'components/Icons/home';
import CheckBoxIcon from 'components/Icons/Sidebar/checkBox.svg';
import ContentPaste from 'components/Icons/Sidebar/contentPaste.svg';
import WonderBot from 'components/Icons/Sidebar/wonderbot.svg';
import FlagIcon from 'components/Icons/Sidebar/flag.svg';
import FolderIcon from 'components/Icons/Sidebar/folder.svg';
import GroupIcon from 'components/Icons/Sidebar/group.svg';
import PieChartIcon from 'components/Icons/Sidebar/pieChart.svg';
import PodIcon from 'components/Icons/Sidebar/pods.svg';
import StartIcon from 'components/Icons/Sidebar/star.svg';
import { GET_TASKS_PER_TYPE, GET_TASKS_PER_TYPE_FOR_POD, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import useMediaQuery from 'hooks/useMediaQuery';
import { useRouter } from 'next/router';
import { ENTITIES_TYPES, ONLY_GRANTS_ENABLED_ORGS, SPECIAL_ORGS } from 'utils/constants';
import { useBoards, useIsMobile, useSideBar } from 'utils/hooks';
import { hasCreateTaskPermission } from 'utils/helpers';
import SidebarEntityListMemoized from './SidebarEntityListMemoized';

const usePerTypeTaskCountForBoard = () => {
  const { board, orgBoard, podBoard } = useBoards();
  const { data: orgData } = useQuery(GET_TASKS_PER_TYPE, {
    variables: {
      orgId: board?.orgId,
    },
    skip: !(orgBoard && board.orgId),
  });
  const { data: podData } = useQuery(GET_TASKS_PER_TYPE_FOR_POD, {
    variables: {
      podId: board?.podId,
    },
    skip: !(podBoard && board.podId),
  });
  return orgData?.getPerTypeTaskCountForOrgBoard || podData?.getPerTypeTaskCountForPodBoard || {};
};

const getCorrectEntities = ({ board, orgBoard, link, router, pathnamesToCheck, taskCount }) => {
  const orgId = board?.orgId || orgBoard?.id;
  const specialOrg = orgId in SPECIAL_ORGS;
  const hasWorkSection =
    !specialOrg ||
    SPECIAL_ORGS[orgId].includes('Tasks') ||
    SPECIAL_ORGS[orgId].includes('Bounties') ||
    SPECIAL_ORGS[orgId].includes('Proposals') ||
    SPECIAL_ORGS[orgId].includes('Milestones');
  const hasSpacesSection =
    !specialOrg ||
    SPECIAL_ORGS[orgId].includes('Pods') ||
    SPECIAL_ORGS[orgId].includes('Grants') ||
    SPECIAL_ORGS[orgId].includes('Collaborations');
  const workItems = [];
  if (hasWorkSection) {
    if (SPECIAL_ORGS[orgId]?.includes('Tasks')) {
      workItems.push({
        text: 'Tasks',
        Icon: CheckBoxIcon,
        link: `${link}/boards?entity=${ENTITIES_TYPES.TASK}`,
        count: taskCount.taskCount,
        check: () => pathnamesToCheck.includes(router.pathname) && board?.entityType === ENTITIES_TYPES.TASK,
        entityType: ENTITIES_TYPES.TASK,
      });
    }
    if (SPECIAL_ORGS[orgId]?.includes('Bounties')) {
      workItems.push({
        text: 'Bounties',
        Icon: StartIcon,
        link: `${link}/boards?entity=${ENTITIES_TYPES.BOUNTY}`,
        check: () => pathnamesToCheck.includes(router.pathname) && board?.entityType === ENTITIES_TYPES.BOUNTY,
        count: taskCount.bountyCount,
        entityType: ENTITIES_TYPES.BOUNTY,
      });
    }
    if (SPECIAL_ORGS[orgId]?.includes('Milestones')) {
      workItems.push({
        text: 'Milestones',
        Icon: FlagIcon,
        check: () => pathnamesToCheck.includes(router.pathname) && board?.entityType === ENTITIES_TYPES.MILESTONE,
        link: `${link}/boards?entity=${ENTITIES_TYPES.MILESTONE}`,
        count: taskCount.milestoneCount,
        entityType: ENTITIES_TYPES.MILESTONE,
      });
    }
    if (SPECIAL_ORGS[orgId]?.includes('Proposals')) {
      workItems.push({
        text: 'Proposals',
        Icon: ContentPaste,
        link: `${link}/boards?entity=${ENTITIES_TYPES.PROPOSAL}`,
        check: () => pathnamesToCheck.includes(router.pathname) && board?.entityType === ENTITIES_TYPES.PROPOSAL,
        count: taskCount.proposalCount,
        entityType: ENTITIES_TYPES.PROPOSAL,
      });
    }
  }

  const spacesItems = [];
  if (hasSpacesSection) {
    if (SPECIAL_ORGS[orgId]?.includes('Pods') && !!orgBoard) {
      spacesItems.push({
        text: 'Pods',
        Icon: PodIcon,
        link: `${link}/spaces`,
        entityType: ENTITIES_TYPES.POD,
      });
    }
    if (SPECIAL_ORGS[orgId]?.includes('Grants')) {
      spacesItems.push({
        text: 'Grants',
        Icon: GrantIcon,
        link: `${link}/grants`,
        entityType: ENTITIES_TYPES.GRANT,
      });
    }
    if (SPECIAL_ORGS[orgId]?.includes('Collaborations') && !board?.orgData?.shared && !!orgBoard) {
      spacesItems.push({
        text: 'Collaborations',
        Icon: SmallDao2DaoIcon,
        link: `${link}/collaborations`,
      });
    }
  }
  const data = [
    !board?.orgData?.shared && {
      items: [
        {
          text: `${orgBoard ? 'Project Home' : 'Pod Home'}`,
          Icon: () => <HomeIcon height="12px" width="12px" />,
          link: `${link}/home`,
          check: null,
          entityType: null,
          count: null,
        },
      ],
    },
    hasWorkSection && {
      label: 'Work',
      items: workItems,
    },
    hasSpacesSection && {
      label: 'Spaces',
      items: spacesItems,
    },
    {
      label: 'Community',
      items: [
        {
          text: 'Leaderboard',
          Icon: PieChartIcon,
          link: `${link}/analytics`,
        },
        // { TODO: Put back when mint kudos is out
        //   text: 'Activity',
        //   Icon: ShowChartIcon,
        //   link: `${link}/activities`,
        // },
        {
          text: 'Members',
          Icon: GroupIcon,
          link: `${link}/members`,
        },
        {
          text: 'Documentation',
          Icon: FolderIcon,
          link: `${link}/docs`,
        },
      ],
    },
  ];
  return data;
};
const useSidebarData = () => {
  const { board, orgBoard } = useBoards();
  const { setMinimized } = useSideBar();
  const { isMobileScreen } = useMediaQuery();

  const { setEntityType } = board || {};
  const router = useRouter();
  const { search } = router.query;
  const handleOnClick =
    (link, type = null) =>
    () => {
      if (type && setEntityType) {
        setEntityType(type);
        if (!search) return;
      }
      if (isMobileScreen) {
        setMinimized(true);
      }
      router.push(link);
    };

  const orgLink = board?.orgData?.shared
    ? `/collaboration/${board?.orgData?.username}`
    : `/organization/${board?.orgData?.username}`;
  const link = orgBoard ? orgLink : `/pod/${board?.podId}`;
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  const permissions = userPermissionsContext?.getUserPermissionContext
    ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
    : null;
  const canCreateTask = hasCreateTaskPermission({
    userPermissionsContext: permissions,
    orgId: board?.orgId,
    podId: board?.podId,
  });
  const pathnamesToCheck = [
    '/organization/[username]/boards',
    '/pod/[podId]/boards',
    '/collaboration/[username]/boards',
    '/organization/[username]/wonder_ai_bot',
    '/pod/[podId]/wonder_ai_bot',
  ];

  const taskCount = usePerTypeTaskCountForBoard();

  const data = getCorrectEntities({ board, orgBoard, link, router, pathnamesToCheck, taskCount });
  if (canCreateTask && data) {
    data[1].items.push({
      text: 'WonderBot AI',
      Icon: WonderBot,
      link: `${link}/wonder_ai_bot`,
      check: () => pathnamesToCheck.includes(router.pathname) && router.pathname.includes('wonder_ai_bot'),
      entityType: null,
      count: null,
    });
  }
  return { data, handleOnClick };
};

const SidebarEntityList = () => {
  const router = useRouter();
  const { data, handleOnClick } = useSidebarData();

  const { minimized } = useSideBar();
  return (
    <SidebarEntityListMemoized
      minimized={minimized}
      menuItems={data}
      handleOnClick={handleOnClick}
      urlPath={router.asPath}
    />
  );
};

export default SidebarEntityList;
