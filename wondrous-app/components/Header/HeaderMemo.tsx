import Link from 'next/link';
import { memo } from 'react';
import Box from '@mui/material/Box';

import Wallet from 'components/Common/Wallet';
import { CreateIconOutlined } from 'components/Icons/createBtn';
import { Button } from 'components/Common/button';
import NotificationsBoard from 'components/Notifications';
import Tooltip from 'components/Tooltip';
import HomeIcon from 'components/Icons/home';

import {
  HeaderBar,
  HeaderContainer,
  HeaderCreateButton,
  HeaderHomeButton,
  HeaderLeftBlock,
  HeaderLogo,
  HeaderRightBlock,
  HeaderHomeButtonWrapper,
  HeaderLogoWrapper,
} from './styles';
import GlobalSearch from 'components/GlobalSearch';
import { User } from 'types/User';
import { Notification } from 'types/Notification';

type HeaderProps = {
  fetchMoreNotifications: (fetchData, fetchVars) => unknown;
  isMobile: boolean;
  notifications: Notification[];
  onLogoClick: () => unknown;
  onSignInClick: () => unknown;
  openCreateFormModal: () => unknown;
  setNotifications: () => unknown;
  showCreateButton: boolean;
  user: User | null;
};

const Header = ({
  fetchMoreNotifications,
  isMobile,
  notifications,
  onLogoClick,
  onSignInClick,
  openCreateFormModal,
  setNotifications,
  showCreateButton,
  user,
}: HeaderProps) => {
  console.log('Header Render');

  return (
    <HeaderBar>
      <HeaderContainer>
        <HeaderLeftBlock>
          <Tooltip title="Explore page">
            <HeaderLogoWrapper>
              <div onClick={onLogoClick}>
                <HeaderLogo />
              </div>
            </HeaderLogoWrapper>
          </Tooltip>
          <Tooltip title="Dashboard">
            <Box>
              <Link passHref href="/dashboard">
                <HeaderHomeButtonWrapper>
                  <HeaderHomeButton>
                    <HomeIcon id="tour-header-dashboard-icon" />
                  </HeaderHomeButton>
                </HeaderHomeButtonWrapper>
              </Link>
            </Box>
          </Tooltip>
          {!isMobile && <GlobalSearch />}
        </HeaderLeftBlock>
        <HeaderRightBlock>
          {user && (
            <>
              {!isMobile && <Wallet />}
              <NotificationsBoard
                fetchMoreNotifications={fetchMoreNotifications}
                notifications={notifications}
                setNotifications={setNotifications}
              />
              <HeaderCreateButton highlighted="true" onClick={openCreateFormModal} visibility={showCreateButton}>
                <CreateIconOutlined id="tour-header-create-btn" />
              </HeaderCreateButton>
            </>
          )}
          {!user && (
            <Button
              highlighted
              type="submit"
              style={{
                width: '100px',
              }}
              onClick={onSignInClick}
            >
              Sign in
            </Button>
          )}
        </HeaderRightBlock>
      </HeaderContainer>
    </HeaderBar>
  );
};

// eslint-disable-next-line react/display-name
export default memo(Header, (prevProps, nextProps) => {
  // We could use lodash like isEqual(pick(prevProps, fields), pick(nextProps, fields));
  // But the code below is much faster
  return (
    prevProps.isMobile === nextProps.isMobile &&
    prevProps.showCreateButton === nextProps.showCreateButton &&
    prevProps.user?.id === nextProps.user?.id &&
    prevProps.notifications.every((notification, index) => notification.id === nextProps.notifications[index]?.id)
  );
});
