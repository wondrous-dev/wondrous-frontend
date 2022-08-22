import { Typography } from '@mui/material';
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
import styled from 'styled-components';
import { ENTITIES_TYPES } from 'utils/constants';
import { useOrgBoard } from 'utils/hooks';
import { Label } from '../Common/styles';

const useDaoSidebarData = () => {
  const { orgData } = useOrgBoard();
  const username = orgData?.username;
  return [
    {
      label: '',
      items: [
        {
          text: 'Dashboard',
          Icon: HomeIcon,
          link: null, // to new project page
        },
        {
          text: 'Activity',
          Icon: ShowChartIcon,
          link: `/organization/${username}/activities`,
        },
        {
          text: 'Analytics',
          Icon: PieChartIcon,
          link: `/organization/${username}/analytics`,
        },
        {
          text: 'Resources',
          Icon: FolderIcon,
          link: `/organization/${username}/docs`,
        },
        {
          text: 'Pods',
          Icon: PodIcon,
          link: null, // link: not sure yet
        },
      ],
    },
    {
      label: 'Workspaces',
      items: [
        {
          text: 'Tasks',
          Icon: CheckBoxIcon,
          link: `/organization/${username}/boards?entity=${ENTITIES_TYPES.TASK}`,
        },
        {
          text: 'Bounties',
          Icon: StartIcon,
          link: `/organization/${username}/boards?entity=${ENTITIES_TYPES.BOUNTY}`,
        },
        {
          text: 'Milestones',
          Icon: FlagIcon,
          link: `/organization/${username}/boards?entity=${ENTITIES_TYPES.MILESTONE}`,
        },
        {
          text: 'Proposals',
          Icon: ContentPaste,
          link: `/organization/${username}/boards?entity=${ENTITIES_TYPES.PROPOSAL}`,
        },
      ],
    },
    {
      label: 'Community',
      items: [
        {
          text: 'Members',
          Icon: GroupIcon,
          link: `/organization/${username}/members`,
        },
        {
          text: 'Roles',
          Icon: StackIcon,
          link: null, // link: new page,
        },
      ],
    },
  ];
};

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ListItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 36px;
`;

const List = () => {
  const daoSidebarData = useDaoSidebarData();
  const router = useRouter();
  const routerPush = (params) => () => router.push(params);
  const isActive = (link) => router.asPath.includes(link);
  return (
    <ListItemWrapper>
      {daoSidebarData?.map(({ label, items }) => (
        <ItemWrapper key={label}>
          <Label>{label}</Label>
          <ItemWrapper>
            {items.map(({ text, link, Icon }) => (
              <Item key={text} onClick={routerPush(link)} Icon={Icon} isActive={isActive(link)}>
                {text}
              </Item>
            ))}
          </ItemWrapper>
        </ItemWrapper>
      ))}
    </ListItemWrapper>
  );
};

export default List;
