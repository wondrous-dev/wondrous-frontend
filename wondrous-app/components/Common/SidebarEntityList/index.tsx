import { useQuery } from '@apollo/client';
import Grid from '@mui/material/Grid';
import { Label, ListWrapper } from 'components/Common/SidebarStyles';
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
import PodIcon from 'components/Icons/Sidebar/pods.svg';
import { GET_TASKS_PER_TYPE, GET_TASKS_PER_TYPE_FOR_POD } from 'graphql/queries';
import { useRouter } from 'next/router';
import { ENTITIES_TYPES } from 'utils/constants';
import { useBoards } from 'utils/hooks';
import { SmallDao2DaoIcon } from 'components/Icons/Dao2Dao';
import GrantIcon from 'components/Icons/GrantIcon';
import HomeIcon from 'components/Icons/home';

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
  const taskCount = usePerTypeTaskCountForBoard();
  const sidebarData = {
    handleOnClick,
    data: [
      orgBoard && !board?.orgData?.shared
        ? {
            items: [
              {
                text: 'Project Home',
                Icon: () => <HomeIcon height="12px" width="12px" />,
                link: `${link}/project`,
              },
            ],
          }
        : null,
      {
        label: 'Workspaces',
        items: [
          {
            text: 'Tasks',
            Icon: CheckBoxIcon,
            link: `${link}/boards?entity=${ENTITIES_TYPES.TASK}`,
            count: taskCount.taskCount,
            entityType: ENTITIES_TYPES.TASK,
          },
          {
            text: 'Bounties',
            Icon: StartIcon,
            link: `${link}/boards?entity=${ENTITIES_TYPES.BOUNTY}`,
            count: taskCount.bountyCount,
            entityType: ENTITIES_TYPES.BOUNTY,
          },
          {
            text: 'Milestones',
            Icon: FlagIcon,
            link: `${link}/boards?entity=${ENTITIES_TYPES.MILESTONE}`,
            count: taskCount.milestoneCount,
            entityType: ENTITIES_TYPES.MILESTONE,
          },
          {
            text: 'Proposals',
            Icon: ContentPaste,
            link: `${link}/boards?entity=${ENTITIES_TYPES.PROPOSAL}`,
            count: taskCount.proposalCount,
            entityType: ENTITIES_TYPES.PROPOSAL,
          },
          !!orgBoard && {
            text: 'Pods',
            Icon: PodIcon,
            link: `${link}/pods`,
            count: board?.orgData?.podCount,
          },
          {
            text: 'Grants',
            Icon: GrantIcon,
            link: `${link}/grants`,
            count: taskCount?.grantCount,
          },
          !board?.orgData?.shared && {
            text: 'Collaborations',
            Icon: SmallDao2DaoIcon,
            link: `${link}/collaborations`,
          },
        ],
      },
      {
        label: 'Community',
        items: [
          {
            text: 'Leaderboard/Analytics',
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
            text: 'Roles',
            Icon: StackIcon,
            link: {
              pathname: router.pathname,
              query: {
                ...router.query,
                roles: true,
              },
            },
          },

          {
            text: 'Documentation',
            Icon: FolderIcon,
            link: `${link}/docs`,
          },
        ],
      },
    ],
  };
  return sidebarData;
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
    <div>
      {data?.map((i) => {
        if (!i) return null;
        const { label, items } = i;
        return (
          <Grid container item flexDirection="column" key={label} padding="6px 0">
            <Label>{label}</Label>
            <ListWrapper>
              {items.map(
                ({ text, link, Icon, count, entityType = null }) =>
                  !!text && (
                    <Item
                      key={text}
                      onClick={handleOnClick(link, entityType)}
                      Icon={Icon}
                      isActive={isActive(entityType, link)}
                      count={count}
                    >
                      {text}
                    </Item>
                  )
              )}
            </ListWrapper>
          </Grid>
        );
      })}
    </div>
  );
};

export default List;
