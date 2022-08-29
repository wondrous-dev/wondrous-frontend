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
    skip: podBoard,
  });
  const { data: podData } = useQuery(GET_TASKS_PER_TYPE_FOR_POD, {
    variables: {
      podId: board?.podId,
    },
    skip: orgBoard,
  });
  return orgData?.getPerTypeTaskCountForOrgBoard || podData?.getPerTypeTaskCountForPodBoard || {};
};

const useSidebarData = () => {
  const { board, orgBoard } = useBoards();
  const router = useRouter();
  const link = orgBoard ? `/organization/${board?.orgData?.username}` : `/pod/${board?.podId}`;
  const taskCount = usePerTypeTaskCountForBoard();
  return [
    {
      label: 'Workspaces',
      items: [
        {
          text: 'Tasks',
          Icon: CheckBoxIcon,
          link: `${link}/boards?entity=${ENTITIES_TYPES.TASK}`,
          count: taskCount.taskCount,
        },
        {
          text: 'Bounties',
          Icon: StartIcon,
          link: `${link}/boards?entity=${ENTITIES_TYPES.BOUNTY}`,
          count: taskCount.bountyCount,
        },
        {
          text: 'Milestones',
          Icon: FlagIcon,
          link: `${link}/boards?entity=${ENTITIES_TYPES.MILESTONE}`,
          count: taskCount.milestoneCount,
        },
        {
          text: 'Proposals',
          Icon: ContentPaste,
          link: `${link}/boards?entity=${ENTITIES_TYPES.PROPOSAL}`,
          count: taskCount.proposalCount,
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
  ];
};

const List = () => {
  const sidebarData = useSidebarData();
  const router = useRouter();
  const routerPush = (params) => () => router.push(params);
  const isActive = (link) => router.asPath.includes(link);
  return (
    <ListWrapper>
      {sidebarData?.map(({ label, items }) => (
        <ListWrapper key={label}>
          <Label>{label}</Label>
          <ListWrapper>
            {items.map(({ text, link, Icon, count }) => (
              <Item key={text} onClick={routerPush(link)} Icon={Icon} isActive={isActive(link)} count={count}>
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
