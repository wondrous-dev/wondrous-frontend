import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import AddDaoModal from 'components/Common/SidebarMain/AddDaoModal';
import HelpModal from 'components/Common/SidebarMain/HelpModal.jsx';
import { PodModal } from 'components/Common/SidebarMain/PodModal';
import {
  AddIconWrapper,
  BottomButtonIcon,
  ButtonIcon,
  ButtonWrapper,
  DaoIconWrapper,
  DrawerBackButton,
  DrawerBlockWrapper,
  DrawerComponent,
  DrawerContainer,
  DrawerList,
  ExploreButton,
  ExploreIconWrapper,
  HeaderLogo,
  LogoButton,
  MissionControlButton,
  MissionControlIconWrapper,
  NoLogoDAO,
  PodsButton,
  PodsIconWrapper,
  StyledSettingsIcon,
} from 'components/Common/SidebarMain/styles';
import { toolTipStyle } from 'components/Common/SidebarStyles';
import AddIcon from 'components/Icons/add.svg';
import BackArrowIcon from 'components/Icons/backArrow';
import QuestionMarkIcon from 'components/Icons/questionMark.svg';
import ExploreIcon from 'components/Icons/Sidebar/explore.svg';
import GridViewIcon from 'components/Icons/Sidebar/gridView.svg';
import PodsIcon from 'components/Icons/Sidebar/podsGradient.svg';
import Tooltip from 'components/Tooltip';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { memo, useState } from 'react';
import { Org } from 'types/Org';
import { User } from 'types/User';
import { PAGE_PATHNAME } from 'utils/constants';
import SidebarTooltip from '../SidebarMainTooltip';

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

const MissionControlIconButton = ({ isActive = false }) => (
  <SidebarTooltip title="Mission Control">
    <MissionControlButton onClick={() => null} isActive={isActive}>
      <MissionControlIconWrapper>
        <GridViewIcon />
      </MissionControlIconWrapper>
    </MissionControlButton>
  </SidebarTooltip>
);

const ExploreIconButton = ({ isActive = false }) => (
  <SidebarTooltip title="Explore">
    <Link href="/explore" passHref>
      <ExploreButton id="tour-sidebar-explore-top" isActive={isActive}>
        <ExploreIconWrapper isActive={isActive}>
          <ExploreIcon />
        </ExploreIconWrapper>
      </ExploreButton>
    </Link>
  </SidebarTooltip>
);

const PodsIconButton = () => {
  const [openPodModal, setOpenPodModal] = useState(false);
  return (
    <>
      <PodModal open={openPodModal} handleClose={() => setOpenPodModal(false)} />
      <SidebarTooltip title="Pods">
        <PodsButton onClick={() => setOpenPodModal(true)} isActive={openPodModal}>
          <PodsIconWrapper>
            <PodsIcon />
          </PodsIconWrapper>
        </PodsButton>
      </SidebarTooltip>
    </>
  );
};

const CreateModalButton = () => {
  const [openCreateDaoModal, setCreateDaoModal] = useState(false);
  const handleCreateDaoModal = (a) => () => setCreateDaoModal(a);
  return (
    <>
      <AddDaoModal open={openCreateDaoModal} handleClose={handleCreateDaoModal(false)} />
      <SidebarTooltip title="Create DAO">
        <ButtonIcon onClick={handleCreateDaoModal(true)} isActive={openCreateDaoModal}>
          <AddIconWrapper isActive={openCreateDaoModal}>
            <AddIcon />
          </AddIconWrapper>
        </ButtonIcon>
      </SidebarTooltip>
    </>
  );
};

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

const SideBarMemo = ({ orgsList, sidebar, isMobile, handleProfileClick, user, onLogoClick }: Props) => {
  const { minimized, setMinimized } = sidebar;
  const [openHelpModal, setOpenHelpModal] = useState(false);
  const handleMinimize = () => setMinimized(false);
  const router = useRouter();
  const isPageActive = (str) => router.pathname.includes(str);

  if (isMobile) {
    return null;
  }

  return (
    <DrawerComponent variant="permanent" anchor="left">
      <HelpModal open={openHelpModal} handleClose={() => setOpenHelpModal(false)} />
      <DrawerContainer>
        <DrawerBlockWrapper>
          <SidebarTooltip title="Dashboard" id="tour-header-dashboard-icon">
            <LogoButton onClick={onLogoClick}>
              <HeaderLogo />
            </LogoButton>
          </SidebarTooltip>
          <ButtonWrapper>
            <SidebarTooltip title="Profile">
              <ButtonIcon
                id="tour-user-profile"
                onClick={handleProfileClick}
                isActive={isPageActive(PAGE_PATHNAME.profile_username_about)}
              >
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
            
            NOTE: not yet in used 
            
            <MissionControlIconButton />
            
            */}
            <PodsIconButton />
          </ButtonWrapper>
          <ButtonWrapper>
            <ExploreIconButton isActive={isPageActive(PAGE_PATHNAME.explore)} />
            <DrawerList id="tour-sidebar-daos">
              {orgsList?.map(({ id, name, username, isActive, thumbnailPicture, profilePicture }) => (
                <SidebarTooltip key={id} title={name}>
                  <Link key={id} href={`/organization/${username}/boards?entity=task`} passHref>
                    <ButtonIcon button key={id} isActive={isActive}>
                      <DaoIconWrapper>
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
                      </DaoIconWrapper>
                    </ButtonIcon>
                  </Link>
                </SidebarTooltip>
              ))}
              <CreateModalButton />
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
