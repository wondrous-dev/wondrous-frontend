import Link from 'next/link';
import { memo } from 'react';

import Wallet from 'components/Common/Wallet';
import { CreateIconOutlined } from 'components/Icons/createBtn';
import { Button } from 'components/Common/button';
import PodModal from 'components/Header/PodModal';
import NotificationsBoard from 'components/Notifications';
import Tooltip from 'components/Tooltip';
import HomeIcon from 'components/Icons/home';
import PodIcon from 'components/Icons/podIcon';

import GlobalSearch from 'components/GlobalSearch';
import { User } from 'types/User';
import { Notification } from 'types/Notification';
import {
  HeaderBar,
  HeaderContainer,
  HeaderCreateButton,
  HeaderLeftBlock,
  HeaderLogo,
  HeaderRightBlock,
  HeaderButtonWrapper,
  HeaderLogoWrapper,
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
  handlePodModalClose: Function;
  handlePodModalOpen: Function;
  openPodModal: boolean;
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
  handlePodModalClose,
  handlePodModalOpen,
  openPodModal,
}: Props) => (
  <HeaderBar>
    <PodModal open={openPodModal} handleClose={handlePodModalClose} />
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
          <Link passHref href="/dashboard">
            <HeaderButtonWrapper>
              <HomeIcon id="tour-header-dashboard-icon" />
            </HeaderButtonWrapper>
          </Link>
        </Tooltip>
        <Tooltip title="Pods">
          <HeaderButtonWrapper onClick={handlePodModalOpen}>
            <PodIcon />
          </HeaderButtonWrapper>
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

// eslint-disable-next-line react/display-name
export default memo(
  HeaderMemo,
  (prevProps, nextProps) =>
    prevProps.isMobile === nextProps.isMobile &&
    prevProps.showCreateButton === nextProps.showCreateButton &&
    prevProps.user?.id === nextProps.user?.id &&
    prevProps.notifications.length === nextProps.notifications.length &&
    prevProps.openPodModal === nextProps.openPodModal &&
    prevProps.notifications.every(
      (notification, index) =>
        notification.id === nextProps.notifications[index]?.id &&
        notification.viewedAt === nextProps.notifications[index]?.viewedAt
    )
);
