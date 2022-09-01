import Box from '@mui/material/Box';
import Link from 'next/link';
import { memo } from 'react';

import { Button } from 'components/Common/button';
import Wallet from 'components/Common/Wallet';
import { CreateIconOutlined } from 'components/Icons/createBtn';
import HomeIcon from 'components/Icons/home';
import NotificationsBoard from 'components/Notifications';
import Tooltip from 'components/Tooltip';

import { Badge } from '@mui/material';
import GlobalSearch from 'components/GlobalSearch';
import { Notification } from 'types/Notification';
import { User } from 'types/User';
import { useHotkey } from 'utils/hooks';
import { HOTKEYS } from 'utils/hotkeyHelper';
import {
  HeaderBar,
  HeaderContainer,
  HeaderCreateButton,
  HeaderHomeButton,
  HeaderHomeButtonWrapper,
  HeaderLeftBlock,
  HeaderLogo,
  HeaderLogoWrapper,
  HeaderRightBlock,
} from './styles';

type Props = {
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

const HeaderMemo = ({
  fetchMoreNotifications,
  isMobile,
  notifications,
  onLogoClick,
  onSignInClick,
  openCreateFormModal,
  setNotifications,
  showCreateButton,
  user,
}: Props) => {
  const showBadge = useHotkey();

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
          <Badge badgeContent={HOTKEYS.OPEN_DASHBOARD} color="primary" invisible={!showBadge} style={{ zIndex: 999 }}>
            <Tooltip title="Dashboard">
              <Box>
                <Link passHref href="/dashboard">
                  <HeaderHomeButtonWrapper>
                    <HeaderHomeButton style={{ zIndex: 1 }}>
                      <HomeIcon id="tour-header-dashboard-icon" />
                    </HeaderHomeButton>
                  </HeaderHomeButtonWrapper>
                </Link>
              </Box>
            </Tooltip>
          </Badge>
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
                <Badge badgeContent={HOTKEYS.CHOOSE_ENTITY} color="primary" invisible={!showBadge}>
                  <CreateIconOutlined id="tour-header-create-btn" />
                </Badge>
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
export default memo(
  HeaderMemo,
  (prevProps, nextProps) =>
    prevProps.isMobile === nextProps.isMobile &&
    prevProps.showCreateButton === nextProps.showCreateButton &&
    prevProps.user?.id === nextProps.user?.id &&
    prevProps.notifications.length === nextProps.notifications.length &&
    prevProps.notifications.every(
      (notification, index) =>
        notification.id === nextProps.notifications[index]?.id &&
        notification.viewedAt === nextProps.notifications[index]?.viewedAt
    )
);
