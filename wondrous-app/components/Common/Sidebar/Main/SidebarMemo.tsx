import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import AddIcon from 'components/Icons/add.svg';
import BackArrowIcon from 'components/Icons/backArrow';
import ExploreIcon from 'components/Icons/Sidebar/explore.svg';
import QuestionMarkIcon from 'components/Icons/questionMark.svg';
import { PodsIcon } from 'components/Icons/sidebar';
import Tooltip from 'components/Tooltip';
import Link from 'next/link';
import React, { memo, useState } from 'react';
import { Org } from 'types/Org';
import { User } from 'types/User';

import { toolTipStyle } from '../styles';
import AddDaoModal from './AddDaoModal';
import HelpModal from './HelpModal.jsx';
import { PodModal } from './PodModal';
import {
  ButtonWrapper,
  DrawerBackButton,
  DrawerBlockWrapper,
  DrawerComponent,
  DrawerContainer,
  DrawerList,
  DrawerListItem,
  HeaderLogo,
  ButtonIcon,
  LogoButton,
  MissionControlButton,
  NoLogoDAO,
  PodsButton,
  StyledSettingsIcon,
  HighlightedButton,
  BottomButtonIcon,
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
  onLogoClick: Function;
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

const SideBarMemo = ({ orgsList, sidebar, isMobile, handleProfileClick, user, onLogoClick }: Props) => {
  const { minimized, setMinimized } = sidebar;
  const [openPodModal, setOpenPodModal] = useState(false);
  const [openHelpModal, setOpenHelpModal] = useState(false);
  const { openCreateDaoModal, handleCreateDaoModal } = useCreateDaoModalState();
  const handleMinimize = () => setMinimized(false);

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
      tooltipLabel: 'Profile Settings',
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
    <DrawerComponent variant="permanent" anchor="left">
      <PodModal open={openPodModal} handleClose={() => setOpenPodModal(false)} />
      <HelpModal open={openHelpModal} handleClose={() => setOpenHelpModal(false)} />
      <AddDaoModal open={openCreateDaoModal} handleClose={handleCreateDaoModal(false)} />
      <DrawerContainer>
        <DrawerBlockWrapper>
          <SidebarTooltip title="Dashboard" id="tour-header-dashboard-icon">
            <LogoButton onClick={onLogoClick}>
              <HeaderLogo />
            </LogoButton>
          </SidebarTooltip>
          <ButtonWrapper>
            <SidebarTooltip title="Profile">
              <ButtonIcon id="tour-user-profile" onClick={handleProfileClick}>
                <SafeImage
                  src={user?.thumbnailPicture || user?.profilePicture}
                  placeholderComp={<DefaultUserImage style={profilePictureStyle} />}
                  width={36}
                  height={36}
                  objectFit="cover"
                  useNextImage
                  style={profilePictureStyle}
                />
              </ButtonIcon>
            </SidebarTooltip>
            {/* 
            
            TODO: uncomment when the page is implemented
            
            <SidebarTooltip title="Mission Control">
              <MissionControlButton onClick={() => null} />
            </SidebarTooltip>
            
            */}
            <SidebarTooltip title="Pods">
              <PodsButton onClick={() => setOpenPodModal(true)} />
            </SidebarTooltip>
          </ButtonWrapper>
          <ButtonWrapper>
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
                            borderRadius: '50%',
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
                <ButtonIcon onClick={handleCreateDaoModal(true)}>
                  <AddIcon />
                </ButtonIcon>
              </SidebarTooltip>
            </DrawerList>
          </ButtonWrapper>
        </DrawerBlockWrapper>
        <DrawerBlockWrapper>
          {BOTTOM_LINKS_CONFIG.map(({ icon: Icon, url, id, tooltipLabel, key }) => {
            const externalProps = isExternal(url) ? { target: '__blank', rel: 'noreferrer' } : {};
            if (key === 'tutorials') {
              // Open up modal instead
              return (
                <SidebarTooltip key={id} title={tooltipLabel}>
                  <BottomButtonIcon onClick={() => setOpenHelpModal(true)}>
                    <Icon />
                  </BottomButtonIcon>
                </SidebarTooltip>
              );
            }
            return (
              <SidebarTooltip key={id} title={tooltipLabel}>
                <BottomButtonIcon>
                  <Link href={url} passHref>
                    <a href={url} {...externalProps}>
                      <Icon />
                    </a>
                  </Link>
                </BottomButtonIcon>
              </SidebarTooltip>
            );
          })}
          {minimized && (
            <Tooltip style={toolTipStyle} title="Expand Sidebar" placement="right">
              <DrawerBackButton onClick={handleMinimize}>
                <BackArrowIcon />
              </DrawerBackButton>
            </Tooltip>
          )}
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
