import React from 'react';
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
} from './styles';
import SettingsIcon from '../Icons/settings';
import ExitIcon from '../Icons/exit';
import BackArrowIcon from '../Icons/backArrow';
import { logout, useMe, withAuth } from '../Auth/withAuth';
import { useSideBar } from '../../utils/hooks';
import { useQuery } from '@apollo/client';
import { GET_USER_ORGS } from '../../graphql/queries';
import { SafeImage } from '../Common/Image';
import DefaultUserImage from '../Common/Image/DefaultUserImage';
import { useRouter } from 'next/router';
import { DAOIcon } from '../Icons/dao';

const SideBarComponent = (props) => {
  const { data: userOrgs } = useQuery(GET_USER_ORGS);
  const sidebar = useSideBar();
  const minimized = sidebar?.minimized;
  const setMinimized = sidebar?.setMinimized;
  const router = useRouter();
  const user = useMe();

  const handleMinimize = (event) => {
    if (setMinimized) {
      setMinimized(!minimized);
    }
  };

  const signOut = () => {
    logout();
  };

  const generalSettings = () => {
    router.push('/profile/settings');
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
      <DrawerContainer>
        <DrawerTopBlock>
          <DrawerTopBlockItem
            onClick={() => {
              router.push(`/profile/${user.username}/about`);
            }}
          >
            {user?.profilePicture ? (
              <SafeImage style={profilePictureStyle} src={user?.thumbnailPicture || user?.profilePicture} />
            ) : (
              <DefaultUserImage style={profilePictureStyle} />
            )}
          </DrawerTopBlockItem>
          <DrawerList>
            {listItems &&
              listItems.map((item) => (
                <DrawerListItem
                  button
                  key={item.id}
                  onClick={() => router.push(`/organization/${item?.username}/boards`)}
                >
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
              ))}
          </DrawerList>
        </DrawerTopBlock>
        <DrawerBottomBlock>
          <DrawerBottomButton onClick={generalSettings}>
            <SettingsIcon />
          </DrawerBottomButton>
          <DrawerBottomButton onClick={signOut}>
            <ExitIcon />
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
