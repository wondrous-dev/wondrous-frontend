import { useQuery } from '@apollo/client';
import WonderBot from 'components/Icons/Sidebar/wonderbot.svg';
import HomeIcon from 'components/Icons/home';
import WrenchIcon from 'components/Icons/wrench';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import useBuildModulesData from 'hooks/modules/useBuildModulesData';
import useCanManage from 'hooks/useCanManage';
import useMediaQuery from 'hooks/useMediaQuery';
import { useRouter } from 'next/router';
import { ENTITIES_TYPES } from 'utils/constants';
import { hasCreateTaskPermission } from 'utils/helpers';
import { useBoards, useSideBar } from 'utils/hooks';
import SidebarEntityListMemoized from './SidebarEntityListMemoized';

const useCanCreateTask = () => {
  const { board } = useBoards();
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
  return canCreateTask;
};

const useBuildSidebarMenuItems = () => {
  const { board, orgBoard, podBoard } = useBoards();
  const router = useRouter();
  const orgLink = board?.orgData?.shared
    ? `/collaboration/${board?.orgData?.username}`
    : `/organization/${board?.orgData?.username}`;
  const link = orgBoard ? orgLink : `/pod/${board?.podId}`;
  const pathnamesToCheck = [
    '/organization/[username]/boards',
    '/pod/[podId]/boards',
    '/collaboration/[username]/boards',
    '/organization/[username]/wonder_ai_bot',
    '/pod/[podId]/wonder_ai_bot',
  ];
  const orgId = board?.orgId || orgBoard?.id;
  const podId = board?.podId || podBoard?.id;
  const modules = useBuildModulesData({ orgId, podId });
  const canManage = useCanManage();

  const workspaceItems = {
    [ENTITIES_TYPES.POD]: {
      ...modules?.pod,
      text: 'Pods',
      link: `${link}/pods`,
      entityType: ENTITIES_TYPES.POD,
    },
    [ENTITIES_TYPES.TASK]: {
      ...modules?.task,
      text: 'Tasks',
      link: `${link}/boards?entity=${ENTITIES_TYPES.TASK}`,
      check: () => pathnamesToCheck.includes(router.pathname) && board?.entityType === ENTITIES_TYPES.TASK,
      entityType: ENTITIES_TYPES.TASK,
    },
    [ENTITIES_TYPES.BOUNTY]: {
      ...modules?.bounty,
      text: 'Bounties',
      link: `${link}/boards?entity=${ENTITIES_TYPES.BOUNTY}`,
      check: () => pathnamesToCheck.includes(router.pathname) && board?.entityType === ENTITIES_TYPES.BOUNTY,
      entityType: ENTITIES_TYPES.BOUNTY,
    },
    [ENTITIES_TYPES.MILESTONE]: {
      ...modules?.milestone,
      text: 'Milestones',
      check: () => pathnamesToCheck.includes(router.pathname) && board?.entityType === ENTITIES_TYPES.MILESTONE,
      link: `${link}/boards?entity=${ENTITIES_TYPES.MILESTONE}`,
      entityType: ENTITIES_TYPES.MILESTONE,
    },
    [ENTITIES_TYPES.PROPOSAL]: {
      ...modules?.proposal,
      text: 'Proposals',
      link: `${link}/boards?entity=${ENTITIES_TYPES.PROPOSAL}`,
      check: () => pathnamesToCheck.includes(router.pathname) && board?.entityType === ENTITIES_TYPES.PROPOSAL,
      entityType: ENTITIES_TYPES.PROPOSAL,
    },
    [ENTITIES_TYPES.GRANT]: {
      ...modules?.grant,
      text: 'Grants',
      link: `${link}/grants`,
      entityType: ENTITIES_TYPES.GRANT,
    },
    [ENTITIES_TYPES.COLLAB]: {
      ...modules?.collab,
      text: 'Collaborations',
      link: `${link}/collaborations`,
    },
    Documentation: {
      ...modules?.document,
      text: 'Documentation',
      link: `${link}/docs`,
    },
  };
  const generalItems = {
    'Project Home': {
      text: `${orgBoard ? 'Project Home' : 'Pod Home'}`,
      Icon: () => <HomeIcon height="12px" width="12px" />,
      link: `${link}/home`,
      check: null,
      entityType: null,
      count: null,
      active: true,
    },
    Leaderboard: {
      ...modules?.leaderboard,
      text: 'Leaderboard',
      link: `${link}/analytics`,
    },
    'WonderBot AI': {
      text: 'WonderBot AI',
      Icon: WonderBot,
      link: `${link}/wonder_ai_bot`,
      check: () => pathnamesToCheck.includes(router.pathname) && router.pathname.includes('wonder_ai_bot'),
      active: useCanCreateTask(),
    },
    ...(orgBoard && !orgBoard?.orgData?.shared
      ? {
          'Setup Project': {
            text: 'Setup Project',
            link: `${link}/onboarding`,
            Icon: WrenchIcon,
            active: canManage,
          },
        }
      : {}),
  };
  const menu = {
    general: {
      label: 'General',
      items: generalItems,
    },
    workspace: {
      label: 'Workspace',
      items: workspaceItems,
    },
  };
  return menu;
};

const useSidebarOnClick = () => {
  const { board } = useBoards();
  const { setMinimized } = useSideBar();
  const { isMobileScreen } = useMediaQuery();

  const { setEntityType } = board || {};
  const router = useRouter();
  const { search } = router.query;
  const handleOnClick =
    (link, type = null) =>
    () => {
      if (
        type &&
        setEntityType &&
        type !== ENTITIES_TYPES.POD &&
        type !== ENTITIES_TYPES.GRANT &&
        type !== ENTITIES_TYPES.COLLAB
      ) {
        setEntityType(type);
        if (!search) return;
      }
      if (isMobileScreen) {
        setMinimized(true);
      }
      router.push(link);
    };

  return handleOnClick;
};

const SidebarEntityList = () => {
  const router = useRouter();
  const sidebarMenuItems = useBuildSidebarMenuItems();
  const handleOnClick = useSidebarOnClick();

  const { minimized } = useSideBar();
  return (
    <SidebarEntityListMemoized
      minimized={minimized}
      menuItems={sidebarMenuItems}
      handleOnClick={handleOnClick}
      urlPath={router.asPath}
    />
  );
};

export default SidebarEntityList;
