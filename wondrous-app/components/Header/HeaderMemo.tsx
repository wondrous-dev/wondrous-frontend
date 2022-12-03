import { memo, useState } from 'react';
import { Menu } from '@mui/icons-material';

import { User } from 'types/User';

import { Button } from 'components/Common/button';
import Wallet from 'components/Common/Wallet';
import GlobalSearch from 'components/GlobalSearch';
import { CreateIconOutlined } from 'components/Icons/createBtn';
import NotificationsBoard from 'components/Notifications';
import HeaderItems, { TYPES } from 'components/HeaderItems';
import useSideBar from 'hooks/useSideBar';

import { HeaderBar, HeaderCreateButton, HeaderItemWrapper, MenuContainer } from './styles';
import Grid from '@mui/material/Grid';

type Props = {
  isMobile: boolean;
  onSignInClick: () => unknown;
  showCreateButton: boolean;
  user: User | null;
};

const HeaderMemo = ({ isMobile, onSignInClick, showCreateButton, user }: Props) => {
  const { setMinimized, minimized } = useSideBar();
  // const [openCreateFormModal, setOpenCreateFormModal] = useState(false);
  const [activeModalType, setActiveModalType] = useState<TYPES | null>(null);
  const toggleMinimize = () => {
    if (minimized) {
      setMinimized(false);
    }
  };
  
  const handleActiveModalType = (type: TYPES) => {
    if(activeModalType === type) {
      return setActiveModalType(null);
    }
    return setActiveModalType(type);
  };

  return (
    <HeaderBar minimized={minimized}>
      {/* <div style={{height: '30px', width: '30px', color: 'white', background: 'red'}}>hello</div> */}
      {isMobile ? (
        <MenuContainer onClick={toggleMinimize}>
          <Menu />
        </MenuContainer>
      ) : null}
      {user && (
        <Grid display="flex" width="100%">
          <GlobalSearch />
          <Grid display="flex" gap="14px" position="relative">
            {activeModalType ? (
              <HeaderItemWrapper>
                <HeaderItems type={activeModalType} onClose={() => setActiveModalType(null)} />
              </HeaderItemWrapper>
            ) : null}
            {!isMobile && <Wallet />}
            <NotificationsBoard />

            {showCreateButton && (
              <HeaderCreateButton
                highlighted="true"
                isActive={activeModalType === TYPES.CREATE_ENTITY}
                onClick={() => handleActiveModalType(TYPES.CREATE_ENTITY)}
                visibility={showCreateButton}
                data-cy="header-button-create"
              >
                <CreateIconOutlined id="tour-header-create-btn" />
              </HeaderCreateButton>
            )}
          </Grid>
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
