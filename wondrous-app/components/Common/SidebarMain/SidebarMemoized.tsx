import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import {
  BottomButtonIcon,
  ButtonIcon,
  ButtonWrapper,
  DaoIconWrapper,
  DrawerBackButton,
  DrawerBlockWrapper,
  DrawerComponent,
  DrawerContainer,
  DrawerList,
  NoLogoDAO,
  StyledSettingsIcon,
} from 'components/Common/SidebarMain/styles';
import AddDaoButton from 'components/Common/SidebarMainAddDao';
import ExploreIconButton from 'components/Common/SidebarMainExplore';
import SidebarMainLogo from 'components/Common/SidebarMainLogo';
import MissionControlIconButton from 'components/Common/SidebarMainMissionControl';
import PodsIconButton from 'components/Common/SidebarMainPods';
import SidebarTooltip from 'components/Common/SidebarMainTooltip';
import { toolTipStyle } from 'components/Common/SidebarStyles';
import BackArrowIcon from 'components/Icons/backArrow';
import QuestionMarkIcon from 'components/Icons/questionMark.svg';
import Tooltip from 'components/Tooltip';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { memo, useState } from 'react';
import { Org } from 'types/Org';
import { User } from 'types/User';
import { PAGE_PATHNAME } from 'utils/constants';

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

const profilePictureStyle = {
  display: 'flex',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  objectFit: 'cover' as any,
};

const SidebarMemoized = ({ orgsList, sidebar, isMobile, handleProfileClick, user, onLogoClick }: Props) => {
  const { minimized, setMinimized } = sidebar;
  const handleMinimize = () => setMinimized(false);
  const router = useRouter();
  const isPageActive = (str) => router.pathname.includes(str);

  return (
    <DrawerComponent
      variant={isMobile ? 'temporary' : 'permanent'}
      anchor="left"
      open={minimized}
      onClose={handleMinimize}
    >
      <DrawerContainer>
        <DrawerBlockWrapper>
          <SidebarMainLogo key={router.asPath} onClick={onLogoClick} isActive={isPageActive(PAGE_PATHNAME.explore)} />
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
                  useNextImage
                  style={profilePictureStyle}
                  alt="User profile picture"
                />
              </ButtonIcon>
            </SidebarTooltip>

            <MissionControlIconButton isActive={isPageActive(PAGE_PATHNAME.mission_control)} />

            <PodsIconButton />
          </ButtonWrapper>
          <ButtonWrapper>
            <ExploreIconButton isActive={isPageActive(PAGE_PATHNAME.explore)} />
            <DrawerList id="tour-sidebar-daos">
              {orgsList?.map(({ id, name, username, isActive, thumbnailPicture, profilePicture }) => (
                <SidebarTooltip key={id} title={name}>
                  <Link key={id} href={`/organization/${username}/home`} passHref>
                    <ButtonIcon button key={id} isActive={isActive}>
                      <DaoIconWrapper>
                        {thumbnailPicture || profilePicture ? (
                          <SafeImage
                            useNextImage={false}
                            src={thumbnailPicture || profilePicture}
                            width={36}
                            height={36}
                            style={{
                              borderRadius: '50%',
                              objectFit: 'cover',
                            }}
                            alt="Organization logo"
                          />
                        ) : (
                          <NoLogoDAO />
                        )}
                      </DaoIconWrapper>
                    </ButtonIcon>
                  </Link>
                </SidebarTooltip>
              ))}
              <AddDaoButton />
            </DrawerList>
          </ButtonWrapper>
        </DrawerBlockWrapper>
        <DrawerBlockWrapper>
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
  SidebarMemoized,
  (prevProps, nextProps) =>
    prevProps.isMobile === nextProps.isMobile &&
    prevProps.sidebar?.minimized === nextProps.sidebar?.minimized &&
    prevProps.user?.id === nextProps.user?.id &&
    prevProps.orgsList.length === nextProps.orgsList.length &&
    prevProps.orgsList.every(
      (org, index) => org.id === nextProps.orgsList[index]?.id && org.isActive === nextProps.orgsList[index]?.isActive
    )
);
