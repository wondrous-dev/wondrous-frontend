import CheckBoxIcon from 'components/Common/Sidebar/Common/icons/checkBox.svg';
import ContentPaste from 'components/Common/Sidebar/Common/icons/contentPaste.svg';
import FlagIcon from 'components/Common/Sidebar/Common/icons/flag.svg';
import FolderIcon from 'components/Common/Sidebar/Common/icons/folder.svg';
import GroupIcon from 'components/Common/Sidebar/Common/icons/group.svg';
import HomeIcon from 'components/Common/Sidebar/Common/icons/home.svg';
import PieChartIcon from 'components/Common/Sidebar/Common/icons/pieChart.svg';
import PodIcon from 'components/Common/Sidebar/Common/icons/pods.svg';
import ShowChartIcon from 'components/Common/Sidebar/Common/icons/showChart.svg';
import StackIcon from 'components/Common/Sidebar/Common/icons/stack.svg';
import StartIcon from 'components/Common/Sidebar/Common/icons/star.svg';
import Item from 'components/Common/Sidebar/Common/Item';
import { useRouter } from 'next/router';
import { ENTITIES_TYPES } from 'utils/constants';
import { useBoards } from 'utils/hooks';

import { Label, ListWrapper } from '../Common/styles';

const useSidebarData = () => {
  const { board, orgBoard } = useBoards();
  const router = useRouter();
  const link = orgBoard ? `/organization/${board?.orgData?.username}` : `/pod/${board?.podId}`;
  return [
    {
      label: '',
      items: [
        // {
        //   text: 'Dashboard',
        //   Icon: HomeIcon,
        //   link: null, // to new project page
        // },
        {
          text: 'Activity',
          Icon: ShowChartIcon,
          link: `${link}/activities`,
        },
        {
          text: 'Analytics',
          Icon: PieChartIcon,
          link: `${link}/analytics`,
        },
        {
          text: 'Resources',
          Icon: FolderIcon,
          link: `${link}/docs`,
        },
        // {
        //   text: 'Pods',
        //   Icon: PodIcon,
        //   link: null, // link: not sure yet
        // },
      ],
    },
    {
      label: 'Workspaces',
      items: [
        {
          text: 'Tasks',
          Icon: CheckBoxIcon,
          link: `${link}/boards?entity=${ENTITIES_TYPES.TASK}`,
        },
        {
          text: 'Bounties',
          Icon: StartIcon,
          link: `${link}/boards?entity=${ENTITIES_TYPES.BOUNTY}`,
        },
        {
          text: 'Milestones',
          Icon: FlagIcon,
          link: `${link}/boards?entity=${ENTITIES_TYPES.MILESTONE}`,
        },
        {
          text: 'Proposals',
          Icon: ContentPaste,
          link: `${link}/boards?entity=${ENTITIES_TYPES.PROPOSAL}`,
        },
      ],
    },
    {
      label: 'Community',
      items: [
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
            {items.map(({ text, link, Icon }) => (
              <Item key={text} onClick={routerPush(link)} Icon={Icon} isActive={isActive(link)}>
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
