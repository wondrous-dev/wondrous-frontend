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
  PodButtonDiv,
  StyledDivider,
  StyledDividerDiv,
} from './styles';

import SettingsIcon from '../Icons/settings';
import BackArrowIcon from '../Icons/backArrow';
import { useMe, withAuth } from '../Auth/withAuth';
import { useSideBar } from 'utils/hooks';
import { useQuery } from '@apollo/client';
import { GET_USER_ORGS } from 'graphql/queries';
import { SafeImage } from '../Common/Image';
import DefaultUserImage from '../Common/Image/DefaultUserImage';
import { useRouter } from 'next/router';
import { DAOIcon } from '../Icons/dao';
import { PodModal } from './PodModal';

const PodButton = (props) => {
  return (
    <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="19.0977" cy="19.7314" r="18.5" stroke="url(#paint0_linear_4944_60020)" />
      <ellipse cx="19.0974" cy="25.4193" rx="8.79659" ry="1.48668" stroke="white" strokeLinecap="round" />
      <ellipse cx="19.0974" cy="19.7298" rx="8.79659" ry="1.48668" stroke="white" strokeLinecap="round" />
      <ellipse cx="19.0974" cy="14.0423" rx="8.79659" ry="1.48668" stroke="white" strokeLinecap="round" />
      <defs>
        <linearGradient
          id="paint0_linear_4944_60020"
          x1="41.2799"
          y1="19.7314"
          x2="-0.0273436"
          y2="19.7314"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7427FF" />
          <stop offset="1" stopColor="#00BAFF" />
        </linearGradient>
      </defs>
    </svg>
  );
};

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

  const generalSettings = () => {
    router.push('/profile/settings', undefined, {
      shallow: true,
    });
  };

  const listItems = userOrgs?.getUserOrgs;

  const profilePictureStyle = {
    display: 'flex',
    margin: '0 auto',
    width: '48px',
    height: '48px',
    borderRadius: '24px',
    marginBottom: '12px',
  };
  return (
    <DrawerComponent variant="permanent" anchor="left" className={minimized ? 'active' : ''}>
      <PodModal open={openPodModal} handleClose={() => setOpenPodModal(false)} />
      <DrawerContainer>
        <DrawerTopBlock>
          <Tooltip title="Profile">
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
          <DrawerList>
            {listItems &&
              listItems.map((item) => (
                <Tooltip key={item.id} title={`${item?.username} Board`}>
                  <Link
                    key={item.id}
                    href={`/organization/[username]/boards`}
                    as={`/organization/${item?.username}/boards`}
                    passHref={true}
                  >
                    <DrawerListItem button key={item.id}>
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
                </Tooltip>
              ))}
            <StyledDividerDiv>
              <StyledDivider />
            </StyledDividerDiv>
            <PodButtonDiv>
              <PodButton
                style={{
                  cursor: 'pointer',
                }}
                onClick={() => setOpenPodModal(true)}
              />
            </PodButtonDiv>
          </DrawerList>
        </DrawerTopBlock>
        <DrawerBottomBlock>
          <DrawerBottomButton onClick={generalSettings}>
            <SettingsIcon />
          </DrawerBottomButton>
        </DrawerBottomBlock>
      </DrawerContainer>
      <DrawerBackButton onClick={handleMinimize} className={minimized ? 'active' : ''}>
        <BackArrowIcon />
      </DrawerBackButton>
    </DrawerComponent>
  );
};

export default withAuth(SideBarComponent);
