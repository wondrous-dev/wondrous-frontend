import { ButtonBase, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { ENTITIES_TYPES } from 'utils/constants';
import { useOrgBoard } from 'utils/hooks';

import CheckBoxIcon from './icons/checkBox.svg';
import ContentPaste from './icons/contentPaste.svg';
import FlagIcon from './icons/flag.svg';
import FolderIcon from './icons/folder.svg';
import GroupIcon from './icons/group.svg';
import HomeIcon from './icons/home.svg';
import PieChartIcon from './icons/pieChart.svg';
import PodIcon from './icons/pods.svg';
import ShowChartIcon from './icons/showChart.svg';
import StackIcon from './icons/stack.svg';
import StartIcon from './icons/star.svg';

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

const ItemButton = styled(ButtonBase)`
  && {
    width: 100%;
    height: 32px;
    padding: 1px;
    border-radius: 4px;
    background: transparent;
    background: ${({ isActive }) => isActive && 'linear-gradient(90.03deg, #00baff 0.03%, #7427ff 98.82%)'};
    :hover {
      background: #313131;
    }
  }
`;

const ItemButtonInner = styled.div`
  border-radius: 3px;
  background: transparent;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px;
  padding-left: 0px;
  background: ${({ isActive }) => isActive && '#313131'};
  ${ItemButton}:hover & {
    background: #313131;
  }
`;

const ItemButtonIcon = styled.div`
  width: 22px;
  height: 22px;
  background: #313131;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ isActive }) =>
    isActive &&
    `
      svg {
     path {
        stroke: #00baff;
      }
      rect {
        stroke: #00baff;
      }
    }
    `}
  svg {
    ${ItemButton}:hover & 
      path {
      stroke: #8fe1ff;
    }
    ${ItemButton}:hover & 
      rect {
      stroke: #8fe1ff;
    }
  }
`;

const ItemButtonText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    color: ${({ isActive }) => (isActive ? '#00baff' : '#fff')};
    ${ItemButton}:hover & {
      color: #8fe1ff;
    }
  }
`;

const Label = styled(Typography)`
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  display: flex;
  color: #ccbbff;
`;

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

const Item = ({ children, Icon, isActive, ...props }) => (
  <ItemButton {...props} disableRipple isActive={isActive}>
    <ItemButtonInner isActive={isActive}>
      <ItemButtonIcon isActive={isActive}>
        <Icon />
      </ItemButtonIcon>
      <ItemButtonText isActive={isActive}>{children}</ItemButtonText>
    </ItemButtonInner>
  </ItemButton>
);

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
