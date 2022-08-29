import { useQuery } from '@apollo/client';
import CheckBoxIcon from 'components/Common/Sidebar/Common/icons/checkBox.svg';
import ContentPaste from 'components/Common/Sidebar/Common/icons/contentPaste.svg';
import FlagIcon from 'components/Common/Sidebar/Common/icons/flag.svg';
import FolderIcon from 'components/Common/Sidebar/Common/icons/folder.svg';
import GroupIcon from 'components/Common/Sidebar/Common/icons/group.svg';
import PieChartIcon from 'components/Common/Sidebar/Common/icons/pieChart.svg';
import ShowChartIcon from 'components/Common/Sidebar/Common/icons/showChart.svg';
import StackIcon from 'components/Common/Sidebar/Common/icons/stack.svg';
import StartIcon from 'components/Common/Sidebar/Common/icons/star.svg';
import Item from 'components/Common/Sidebar/Common/Item';
import { Label, ListWrapper } from 'components/Common/Sidebar/Common/styles';
import { GET_TASKS_PER_TYPE, GET_TASKS_PER_TYPE_FOR_POD } from 'graphql/queries';
import { useRouter } from 'next/router';
import { ENTITIES_TYPES } from 'utils/constants';
import { useBoards } from 'utils/hooks';

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
            text: 'Resources',
            Icon: FolderIcon,
            link: `${link}/docs`,
          },
        ],
      },
    ],
  };
};

const List = () => {
  const { data, handleOnClick } = useSidebarData();
  const router = useRouter();
  return (
    <ListWrapper>
      {data?.map(({ label, items }) => (
        <ListWrapper key={label}>
          <Label>{label}</Label>
          <ListWrapper>
            {items.map(({ text, link, Icon, count, entityType = null }) => {
              const isActive = entityType ? window.location.toString().includes(link) : router.asPath.includes(link);
              return (
                <Item
                  key={text}
                  onClick={handleOnClick(link, entityType)}
                  Icon={Icon}
                  isActive={isActive}
                  count={count}
                >
                  {text}
                </Item>
              );
            })}
          </ListWrapper>
        </ListWrapper>
      ))}
    </ListWrapper>
  );
};

export default List;
