import React, { useState } from 'react';
import Link from 'next/link';

import Tooltip from 'components/Tooltip';
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
import { JoinDaoIcon } from 'components/Icons/sidebar';
import BackArrowIcon from '../Icons/backArrow';
import { useMe, withAuth } from '../Auth/withAuth';
import useSideBar from 'hooks/useSideBar';
import { useQuery } from '@apollo/client';
import { GET_USER_ORGS } from 'graphql/queries';
import { SafeImage } from '../Common/Image';
import DefaultUserImage from '../Common/Image/DefaultUserImage';
import { useRouter } from 'next/router';
import { DAOIcon } from '../Icons/dao';
import { PodModal } from './PodModal';

const SideBarComponent = (props) => {
  const { data: userOrgs } = useQuery(GET_USER_ORGS);
  const sidebar = useSideBar();
  const minimized = sidebar?.minimized;
  const setMinimized = sidebar?.setMinimized;
  const router = useRouter();
  const user = useMe();
  const [openPodModal, setOpenPodModal] = useState(false);
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
      tooltipLabel: 'Wonder tutorials',
    },
    {
      key: 'settings',
      icon: StyledSettingsIcon,
      url: '/profile/settings',
      tooltipLabel: 'Settings',
    },
  ];

  const listItems = userOrgs?.getUserOrgs;

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

  return (
    <DrawerComponent variant="permanent" anchor="left" className={minimized ? 'active' : ''}>
      <PodModal open={openPodModal} handleClose={() => setOpenPodModal(false)} />
      <DrawerContainer>
        <DrawerTopBlock>
          <Tooltip title="Profile" style={toolTipStyle}>
            <DrawerTopBlockItem
              onClick={() => {
                router.push(`/profile/${user.username}/about`, undefined, {
                  shallow: true,
                });
              }}
            >
              {user?.profilePicture ? (
                <SafeImage style={profilePictureStyle} src={user?.thumbnailPicture || user?.profilePicture} />
              ) : (
                <DefaultUserImage style={profilePictureStyle} />
              )}
            </DrawerTopBlockItem>
          </Tooltip>

          {TOP_LINKS_CONFIG.map((link, idx) => {
            const Icon = link?.icon;
            const isExternal = link?.url?.includes('https://');
            const externalProps = isExternal ? { target: '__blank', rel: 'noreferrer' } : {};
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
                  {link?.action && <Icon onClick={link?.action} />}
                </DrawerBottomButton>
              </Tooltip>
            );
          })}

          <StyledDividerDiv>
            <StyledDivider />
          </StyledDividerDiv>

          <DrawerList>
            {listItems &&
              listItems.map((item) => {
                const isActive =
                  router.pathname === '/organization/[username]/boards' && router.query?.username === item.username;
                return (
                  <Tooltip key={item.id} title={`${item?.name}`} style={toolTipStyle}>
                    <div>
                      <Link
                        key={item.id}
                        href={`/organization/[username]/boards`}
                        as={`/organization/${item?.username}/boards`}
                        passHref={true}
                      >
                        <DrawerListItem button key={item.id} isActive={isActive}>
                          {item?.profilePicture ? (
                            <SafeImage
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
                );
              })}
            {listItems && !listItems?.length && (
              <Tooltip title={'Explore'} placement="right" style={toolTipStyle}>
                <DrawerBottomButton type="button">
                  <Link href="/explore" passHref>
                    <a>
                      <JoinDaoIcon />
                    </a>
                  </Link>
                </DrawerBottomButton>
              </Tooltip>
            )}
          </DrawerList>
        </DrawerTopBlock>
        <DrawerBottomBlock>
          {BOTTOM_LINKS_CONFIG.map((link, idx) => {
            const Icon = link?.icon;
            const isExternal = link?.url?.includes('https://');
            const externalProps = isExternal ? { target: '__blank', rel: 'noreferrer' } : {};
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

export default withAuth(SideBarComponent);
