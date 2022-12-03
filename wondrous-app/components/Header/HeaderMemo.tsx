import { memo } from 'react';
import { Menu } from '@mui/icons-material';

import { User } from 'types/User';

import { Button } from 'components/Common/button';
import Wallet from 'components/Common/Wallet';
import GlobalSearch from 'components/GlobalSearch';
import { CreateIconOutlined } from 'components/Icons/createBtn';
import NotificationsBoard from 'components/Notifications';

import useSideBar from 'hooks/useSideBar';

import { HeaderBar, HeaderCreateButton, MenuContainer } from './styles';
import Grid from '@mui/material/Grid';

type Props = {
  isMobile: boolean;
  onSignInClick: () => unknown;
  openCreateFormModal: () => unknown;
  showCreateButton: boolean;
  user: User | null;
};

const HeaderMemo = ({ isMobile, onSignInClick, openCreateFormModal, showCreateButton, user }: Props) => {
  const { setMinimized, minimized } = useSideBar();

  const toggleMinimize = () => {
    if(minimized) {
      setMinimized(false);
    }
  };

  return (
    <HeaderBar minimized={minimized}>
      {isMobile ? (
        <MenuContainer onClick={toggleMinimize}>
          <Menu />
        </MenuContainer>
      ) : null}
      {user && (
        <Grid display="flex" width="100%">
          <GlobalSearch />
          {!isMobile && <Wallet />}
          <NotificationsBoard />

          {showCreateButton && (
            <HeaderCreateButton
              highlighted="true"
              onClick={openCreateFormModal}
              visibility={showCreateButton}
              data-cy="header-button-create"
            >
              <CreateIconOutlined id="tour-header-create-btn" />
            </HeaderCreateButton>
          )}
        </Grid>
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
