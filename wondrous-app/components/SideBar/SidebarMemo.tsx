/* eslint-disable import/extensions */
import React, { useState, memo } from 'react';
import Link from 'next/link';

import Tooltip from 'components/Tooltip';
import { User } from 'types/User';
import { Org } from 'types/Org';
import {
  DrawerBackButton,
  DrawerBottomBlock,
  DrawerBottomButton,
  DrawerComponent,
  DrawerContainer,
  DrawerList,
  DrawerListItem,
  DrawerTopBlock,
  DrawerTopBlockItem,
  NoLogoDAO,
  StyledDivider,
  StyledDividerDiv,
  StyledSettingsIcon,
  StyledTutorialsIcon,
  StyledExplorePageIcon,
  StyledPodsIcon,
} from './styles';
import BackArrowIcon from '../Icons/backArrow';
import { SafeImage } from '../Common/Image';
import DefaultUserImage from '../Common/Image/DefaultUserImage';
import { DAOIcon } from '../Icons/dao';
import { PodModal } from './PodModal';
import HelpModal from './HelpModal';

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

const SideBarMemo = ({ orgsList, sidebar, isMobile, handleProfileClick, user }: Props) => {
  const minimized = sidebar?.minimized;
  const setMinimized = sidebar?.setMinimized;
  const [openPodModal, setOpenPodModal] = useState(false);
  const [openHelpModal, setOpenHelpModal] = useState(false);
  const handleMinimize = (event) => {
    if (setMinimized) {
      setMinimized(!minimized);
    }
  };

  const TOP_LINKS_CONFIG = [
    {
      key: 'explore',
      icon: StyledExplorePageIcon,
      url: '/explore',
      tooltipLabel: 'Explore',
      id: 'tour-sidebar-explore-top',
    },
    {
      key: 'pods',
      icon: StyledPodsIcon,
      tooltipLabel: 'Pods',
      action: () => setOpenPodModal(true),
    },
  ];

  const BOTTOM_LINKS_CONFIG = [
    {
      key: 'tutorials',
      icon: StyledTutorialsIcon,
      url: 'https://linktr.ee/wonderverse',
      tooltipLabel: 'Wonder help desk',
    },
    {
      key: 'settings',
      icon: StyledSettingsIcon,
      url: '/profile/settings',
      tooltipLabel: 'Settings',
    },
  ];

  const profilePictureStyle = {
    display: 'flex',
    width: '32px',
    height: '32px',
    borderRadius: '24px',
  };

  const toolTipStyle = {
    fontFamily: 'Space Grotesk',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '20px',
    letterSpacing: '0.01em',
    color: '#C4C4C4',
  };

  if (isMobile) {
    return null;
  }

  return (
    <DrawerComponent variant="permanent" anchor="left" className={minimized ? 'active' : ''}>
      <PodModal open={openPodModal} handleClose={() => setOpenPodModal(false)} />
      <HelpModal open={openHelpModal} handleClose={() => setOpenHelpModal(false)} />
      <DrawerContainer>
        <DrawerTopBlock>
          <Tooltip title="Profile" style={toolTipStyle}>
            <DrawerTopBlockItem id="tour-user-profile" onClick={handleProfileClick}>
              <SafeImage
                src={user?.thumbnailPicture || user?.profilePicture}
                placeholderComp={<DefaultUserImage style={profilePictureStyle} />}
                width={32}
                height={32}
                objectFit="cover"
                useNextImage
                style={profilePictureStyle}
              />
            </DrawerTopBlockItem>
          </Tooltip>

          {TOP_LINKS_CONFIG.map((link, idx) => {
            const Icon = link?.icon;
            const isExternal = link?.url?.includes('https://');
            const externalProps = isExternal ? { target: '__blank', rel: 'noreferrer' } : {};
            const actionProps = link?.action ? { onClick: link?.action } : {};
            if (link.key === 'explore') {
              return (
                <Tooltip key={idx} title={link?.tooltipLabel} placement="right" style={toolTipStyle}>
                  <DrawerBottomButton type="button" {...actionProps}>
                    {!!link?.url && (
                      <Link href="/explore">
                        <Icon id={link?.id} />
                      </Link>
                    )}
                    {link?.action && <Icon />}
                  </DrawerBottomButton>
                </Tooltip>
              );
            }
            return (
              <Tooltip key={idx} title={link?.tooltipLabel} placement="right" style={toolTipStyle}>
                <DrawerBottomButton type="button" {...actionProps}>
                  {!!link?.url && (
                    <Link href={link.url} passHref>
                      <a href={link.url} {...externalProps}>
                        <Icon id={link?.id} />
                      </a>
                    </Link>
                  )}
                  {link?.action && <Icon />}
                </DrawerBottomButton>
              </Tooltip>
            );
          })}

          <StyledDividerDiv>
            <StyledDivider />
          </StyledDividerDiv>

          <DrawerList id="tour-sidebar-daos">
            {orgsList.map((item) => (
              <Tooltip key={item.id} title={`${item?.name}`} style={toolTipStyle}>
                <div>
                  <Link
                    key={item.id}
                    href="/organization/[username]/boards"
                    as={`/organization/${item?.username}/boards`}
                    passHref
                  >
                    <DrawerListItem button key={item.id} isActive={item.isActive}>
                      {item?.profilePicture ? (
                        <SafeImage
                          useNextImage={false}
                          src={item?.thumbnailPicture || item?.profilePicture}
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '6px',
                          }}
                        />
                      ) : (
                        <NoLogoDAO>
                          <DAOIcon />
                        </NoLogoDAO>
                      )}
                    </DrawerListItem>
                  </Link>
                </div>
              </Tooltip>
            ))}
          </DrawerList>
        </DrawerTopBlock>
        <DrawerBottomBlock>
          {BOTTOM_LINKS_CONFIG.map((link, idx) => {
            const Icon = link?.icon;
            const isExternal = link?.url?.includes('https://');
            const externalProps = isExternal ? { target: '__blank', rel: 'noreferrer' } : {};
            if (link.key === 'tutorials') {
              // Open up modal instead
              return (
                <Tooltip key={idx} title={link?.tooltipLabel} placement="right" style={toolTipStyle}>
                  <DrawerBottomButton type="button">
                    {!!link?.url && (
                      <div onClick={() => setOpenHelpModal(true)}>
                        <Icon />
                      </div>
                    )}
                  </DrawerBottomButton>
                </Tooltip>
              );
            }
            return (
              <Tooltip key={idx} title={link?.tooltipLabel} placement="right" style={toolTipStyle}>
                <DrawerBottomButton type="button">
                  {!!link?.url && (
                    <Link href={link.url} passHref>
                      <a href={link.url} {...externalProps}>
                        <Icon />
                      </a>
                    </Link>
                  )}
                </DrawerBottomButton>
              </Tooltip>
            );
          })}
        </DrawerBottomBlock>
      </DrawerContainer>
      <Tooltip style={toolTipStyle} title={minimized ? 'Open panel' : 'Close panel'} placement="top">
        <DrawerBackButton onClick={handleMinimize} className={minimized ? 'active' : ''}>
          <BackArrowIcon />
        </DrawerBackButton>
      </Tooltip>
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
