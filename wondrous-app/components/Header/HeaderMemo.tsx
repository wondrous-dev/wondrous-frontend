import { Badge } from '@mui/material';
import { Button } from 'components/Common/button';
import Wallet from 'components/Common/Wallet';
import GlobalSearch from 'components/GlobalSearch';
import { CreateIconOutlined } from 'components/Icons/createBtn';
import NotificationsBoard from 'components/Notifications';
import { memo } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Notification } from 'types/Notification';
import { User } from 'types/User';
import { useGlobalContext, useHotkey } from 'utils/hooks';
import { HOTKEYS } from 'utils/hotkeyHelper';
import { HeaderBar, HeaderCreateButton } from './styles';

type Props = {
  isMobile: boolean;
  onSignInClick: () => unknown;
  openCreateFormModal: () => unknown;
  showCreateButton: boolean;
  user: User | null;
};

const HeaderMemo = ({ isMobile, onSignInClick, openCreateFormModal, showCreateButton, user }: Props) => {
  const showBadge = useHotkey();
  return (
    <HeaderBar>
      {user && (
        <>
          {!isMobile && <Wallet />}
          {!isMobile && <GlobalSearch />}
          <NotificationsBoard />

          {showCreateButton && (
            <HeaderCreateButton
              highlighted="true"
              onClick={() => {
                openCreateFormModal();
              }}
              visibility={showCreateButton}
            >
              <Badge
                badgeContent={HOTKEYS.CHOOSE_ENTITY}
                color="primary"
                invisible={!showBadge}
                style={{ zIndex: 999 }}
              >
                <CreateIconOutlined id="tour-header-create-btn" />
              </Badge>
            </HeaderCreateButton>
          )}
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
    </HeaderBar>
  );
};

// eslint-disable-next-line react/display-name
export default memo(
  HeaderMemo,
  (prevProps, nextProps) =>
    prevProps.isMobile === nextProps.isMobile &&
    prevProps.showCreateButton === nextProps.showCreateButton &&
    prevProps.user?.id === nextProps.user?.id
);
