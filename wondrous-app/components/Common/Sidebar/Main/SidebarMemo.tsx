import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import AddIcon from 'components/Icons/add.svg';
import BackArrowIcon from 'components/Icons/backArrow';
import ExploreIcon from 'components/Icons/explore.svg';
import QuestionMarkIcon from 'components/Icons/questionMark.svg';
import Tooltip from 'components/Tooltip';
import Link from 'next/link';
import React, { memo, useState } from 'react';
import { Org } from 'types/Org';
import { User } from 'types/User';

import { toolTipStyle } from '../Common/styles';
import AddDaoModal from './AddDaoModal';
import HelpModal from './HelpModal.jsx';
import { PodModal } from './PodModal';
import {
  DrawerBackButton,
  DrawerBlockWrapper,
  DrawerBottomButton,
  DrawerComponent,
  DrawerContainer,
  DrawerList,
  DrawerListItem,
  HighlightedButton,
  NoLogoDAO,
  StyledSettingsIcon,
} from './styles';

type Props = {
  isMobile: boolean;
  user: User;
  handleProfileClick: () => unknown;
  orgsList?: Array<
    Org & {
      isActive: boolean;
    }
  >;
  sidebar: {
    minimized: boolean;
    setMinimized: (minimized: boolean) => unknown;
  };
};

const isExternal = (url) => url.includes('https://');

const useCreateDaoModalState = () => {
  const [openCreateDaoModal, setCreateDaoModal] = useState<boolean>(false);
  const handleCreateDaoModal = (a) => () => setCreateDaoModal(a);
  return { openCreateDaoModal, handleCreateDaoModal };
};

const SidebarTooltip = ({ children, ...props }) => (
  <Tooltip style={toolTipStyle} {...props} placement="right">
    <span>{children}</span>
  </Tooltip>
);

const SideBarMemo = ({ orgsList, sidebar, isMobile, handleProfileClick, user }: Props) => {
  const { minimized, setMinimized } = sidebar;
  const [openPodModal, setOpenPodModal] = useState(false);
  const [openHelpModal, setOpenHelpModal] = useState(false);
  const { openCreateDaoModal, handleCreateDaoModal } = useCreateDaoModalState();
  const handleMinimize = () => setMinimized(!minimized);

  const BOTTOM_LINKS_CONFIG = [
    {
      key: 'tutorials',
      icon: QuestionMarkIcon,
      url: 'https://linktr.ee/wonderverse',
      tooltipLabel: 'Tutorials',
      id: 'wonder-tutorials',
    },
    {
      key: 'settings',
      icon: StyledSettingsIcon,
      url: '/profile/settings',
      tooltipLabel: 'Settings',
      id: 'wonder-settings',
    },
  ];

  const profilePictureStyle = {
    display: 'flex',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
  };

  if (isMobile) {
    return null;
  }

  return (
    <DrawerComponent variant="permanent" anchor="left" className={minimized ? 'active' : ''}>
      <PodModal open={openPodModal} handleClose={() => setOpenPodModal(false)} />
      <HelpModal open={openHelpModal} handleClose={() => setOpenHelpModal(false)} />
      <AddDaoModal open={openCreateDaoModal} handleClose={handleCreateDaoModal(false)} />
      <DrawerContainer>
        <DrawerBlockWrapper>
          <SidebarTooltip title="Profile">
            <HighlightedButton id="tour-user-profile" onClick={handleProfileClick}>
              <SafeImage
                src={user?.thumbnailPicture || user?.profilePicture}
                placeholderComp={<DefaultUserImage style={profilePictureStyle} />}
                width={36}
                height={36}
                objectFit="cover"
                useNextImage
                style={profilePictureStyle}
              />
            </HighlightedButton>
          </SidebarTooltip>

          <SidebarTooltip title="Explore">
            <Link href="/explore" passHref>
              <HighlightedButton id="tour-sidebar-explore-top">
                <ExploreIcon />
              </HighlightedButton>
            </Link>
          </SidebarTooltip>

          <DrawerList id="tour-sidebar-daos">
            {orgsList.map(({ id, name, username, isActive, thumbnailPicture, profilePicture }) => (
              <SidebarTooltip key={id} title={name}>
                <Link key={id} href={`/organization/${username}/boards?entity=task`} passHref>
                  <DrawerListItem button key={id} isActive={isActive}>
                    {thumbnailPicture || profilePicture ? (
                      <SafeImage
                        useNextImage={false}
                        src={thumbnailPicture || profilePicture}
                        width={36}
                        height={36}
                        objectFit="cover"
                        style={{
                          borderRadius: '2px',
                        }}
                      />
                    ) : (
                      <NoLogoDAO />
                    )}
                  </DrawerListItem>
                </Link>
              </SidebarTooltip>
            ))}
            <SidebarTooltip title="Create DAO">
              <HighlightedButton onClick={handleCreateDaoModal(true)}>
                <AddIcon />
              </HighlightedButton>
            </SidebarTooltip>
          </DrawerList>
        </DrawerBlockWrapper>
        <DrawerBlockWrapper>
          {BOTTOM_LINKS_CONFIG.map(({ icon: Icon, url, id, tooltipLabel, key }) => {
            const externalProps = isExternal(url) ? { target: '__blank', rel: 'noreferrer' } : {};
            if (key === 'tutorials') {
              // Open up modal instead
              return (
                <SidebarTooltip key={id} title={tooltipLabel}>
                  <DrawerBottomButton onClick={() => setOpenHelpModal(true)}>
                    <Icon />
                  </DrawerBottomButton>
                </SidebarTooltip>
              );
            }
            return (
              <SidebarTooltip key={id} title={tooltipLabel}>
                <DrawerBottomButton>
                  <Link href={url} passHref>
                    <a href={url} {...externalProps}>
                      <Icon />
                    </a>
                  </Link>
                </DrawerBottomButton>
              </SidebarTooltip>
            );
          })}
          <Tooltip style={toolTipStyle} title={minimized ? 'Expand Sidebar' : 'Collapse Sidebar'} placement="right">
            <DrawerBackButton onClick={handleMinimize} className={minimized && 'active'}>
              <BackArrowIcon />
            </DrawerBackButton>
          </Tooltip>
        </DrawerBlockWrapper>
      </DrawerContainer>
    </DrawerComponent>
  );
};

// eslint-disable-next-line react/display-name
export default memo(
  SideBarMemo,
  (prevProps, nextProps) =>
    prevProps.isMobile === nextProps.isMobile &&
    prevProps.sidebar?.minimized === nextProps.sidebar?.minimized &&
    prevProps.user?.id === nextProps.user?.id &&
    prevProps.orgsList.length === nextProps.orgsList.length &&
    prevProps.orgsList.every(
      (org, index) => org.id === nextProps.orgsList[index]?.id && org.isActive === nextProps.orgsList[index]?.isActive
    )
);
