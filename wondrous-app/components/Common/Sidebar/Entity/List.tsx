import { useQuery } from '@apollo/client';
import { Label, ListWrapper } from 'components/Common/Sidebar/styles';
import Item from 'components/Common/SidebarItem';
import CheckBoxIcon from 'components/Icons/Sidebar/checkBox.svg';
import ContentPaste from 'components/Icons/Sidebar/contentPaste.svg';
import FlagIcon from 'components/Icons/Sidebar/flag.svg';
import FolderIcon from 'components/Icons/Sidebar/folder.svg';
import GroupIcon from 'components/Icons/Sidebar/group.svg';
import PieChartIcon from 'components/Icons/Sidebar/pieChart.svg';
import ShowChartIcon from 'components/Icons/Sidebar/showChart.svg';
import StackIcon from 'components/Icons/Sidebar/stack.svg';
import StartIcon from 'components/Icons/Sidebar/star.svg';
import { GET_ORG_SIDEBAR_COUNT, GET_POD_SIDEBAR_COUNT } from 'graphql/queries';
import { useRouter } from 'next/router';
import { ENTITIES_TYPES } from 'utils/constants';
import { useBoards } from 'utils/hooks';

const useSidebarCount = () => {
  const { board, orgBoard, podBoard } = useBoards();
  const { data: orgData } = useQuery(GET_ORG_SIDEBAR_COUNT, {
    variables: {
      orgId: board?.orgId,
    },
    skip: !(orgBoard && board.orgId),
  });
  const { data: podData } = useQuery(GET_POD_SIDEBAR_COUNT, {
    variables: {
      podId: board?.podId,
    },
    skip: !(podBoard && board.podId),
  });
  return orgData?.getOrgSidebarCount || podData?.getPodSidebarCount || {};
};

const useSidebarData = () => {
  const { board, orgBoard } = useBoards();
  const { setEntityType } = board || {};
  const router = useRouter();
  const handleOnClick =
    (link, type = null) =>
    () => {
      if (type && setEntityType) {
        setEntityType(type);
        return;
      }
      router.push(link);
    };
  const link = orgBoard ? `/organization/${board?.orgData?.username}` : `/pod/${board?.podId}`;
  const sidebarCount = useSidebarCount();
  return {
    handleOnClick,
    data: [
      {
        label: 'Workspaces',
        items: [
          {
            text: 'Tasks',
            Icon: CheckBoxIcon,
            link: `${link}/boards?entity=${ENTITIES_TYPES.TASK}`,
            count: sidebarCount.taskCount,
            entityType: ENTITIES_TYPES.TASK,
          },
          {
            text: 'Bounties',
            Icon: StartIcon,
            link: `${link}/boards?entity=${ENTITIES_TYPES.BOUNTY}`,
            count: sidebarCount.bountyCount,
            entityType: ENTITIES_TYPES.BOUNTY,
          },
          {
            text: 'Milestones',
            Icon: FlagIcon,
            link: `${link}/boards?entity=${ENTITIES_TYPES.MILESTONE}`,
            count: sidebarCount.milestoneCount,
            entityType: ENTITIES_TYPES.MILESTONE,
          },
          {
            text: 'Proposals',
            Icon: ContentPaste,
            link: `${link}/boards?entity=${ENTITIES_TYPES.PROPOSAL}`,
            count: sidebarCount.proposalCount,
            entityType: ENTITIES_TYPES.PROPOSAL,
          },
          // {
          //   text: 'Pods',
          //   Icon: PodIcon,
          //   link: null, // link: not sure yet
          // },
        ],
      },
      {
        label: 'Community',
        items: [
          {
            text: 'Analytics',
            Icon: PieChartIcon,
            link: `${link}/analytics`,
          },
          {
            text: 'Activity',
            Icon: ShowChartIcon,
            link: `${link}/activities`,
          },
          {
            text: 'Members',
            Icon: GroupIcon,
            link: `${link}/members`,
            count: sidebarCount.membersCount,
          },
          {
            text: 'Roles',
            Icon: StackIcon,
            link: {
              pathname: router.pathname,
              query: {
                ...router.query,
                roles: true,
              },
            },
            count: sidebarCount.rolesCount,
          },

          {
            text: 'Resources',
            Icon: FolderIcon,
            link: `${link}/docs`,
            count: sidebarCount.resourcesCount,
          },
        ],
      },
    ],
  };
};

const location = () => {
  if (typeof window !== 'undefined') return window.location.pathname + window.location.search;
  return '';
};

const List = () => {
  const { data, handleOnClick } = useSidebarData();
  const router = useRouter();
  const isActive = (entityType, link) => (entityType ? location().includes(link) : router.asPath.includes(link));
  return (
    <ListWrapper>
      {data?.map(({ label, items }) => (
        <ListWrapper key={label}>
          <Label>{label}</Label>
          <ListWrapper>
            {items.map(({ text, link, Icon, count, entityType = null }) => (
              <Item
                key={text}
                onClick={handleOnClick(link, entityType)}
                Icon={Icon}
                isActive={isActive(entityType, link)}
                count={count}
              >
                {text}
              </Item>
            ))}
          </ListWrapper>
        </ListWrapper>
      ))}
    </ListWrapper>
  );
};

export default List;
