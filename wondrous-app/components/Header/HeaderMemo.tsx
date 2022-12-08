import { memo, useMemo, useRef, useState } from 'react';
import { Menu } from '@mui/icons-material';

import { User } from 'types/User';

import { Button } from 'components/Common/button';
import Wallet from 'components/Common/Wallet';
import GlobalSearch from 'components/GlobalSearch';
import { CreateIconOutlined } from 'components/Icons/createBtn';
import NotificationsBoard from 'components/Notifications';
import HeaderItems, { TYPES } from 'components/HeaderItems';
import useSideBar from 'hooks/useSideBar';
import { Org } from 'types/Org';
import { HeaderBar, HeaderCreateButton, HeaderItemWrapper, MenuContainer } from './styles';
import Grid from '@mui/material/Grid';
import { useGlobalContext, useOutsideAlerter } from 'utils/hooks';
import EntityMenu from 'components/Common/SidebarEntityMenu';
import useMediaQuery from 'hooks/useMediaQuery';
import { useRouter } from 'next/router';
import { PAGE_PATHNAME } from 'utils/constants';

type Props = {
  isMobile: boolean;
  onSignInClick: () => unknown;
  showCreateButton: boolean;
  user: User | null;
  orgsList?: Array<
    Org & {
      isActive: boolean;
    }
  >;
};

const HeaderMemo = ({ isMobile, onSignInClick, showCreateButton, user }: Props) => {
  const { setMinimized, minimized } = useSideBar();
  const { isMobileScreen } = useMediaQuery();
  const headerItemRef = useRef();
  // const [openCreateFormModal, setOpenCreateFormModal] = useState(false);
  const [activeModalType, setActiveModalType] = useState<TYPES | null>(null);
  const router = useRouter();
  const toggleMinimize = () => {
    if (minimized) {
      setMinimized(false);
    }
  };

  useOutsideAlerter(headerItemRef, () => setActiveModalType(null));
  const handleActiveModalType = (type: TYPES) => {
    if (activeModalType === type) {
      return setActiveModalType(null);
    }
    return setActiveModalType(type);
  };

  return (
    <HeaderBar minimized={minimized}>
      {/* <div style={{height: '30px', width: '30px', color: 'white', background: 'red'}}>hello</div> */}
      {isMobile && router.pathname !== PAGE_PATHNAME.explore ? (
        <MenuContainer onClick={toggleMinimize}>
          <Menu />
        </MenuContainer>
      ) : null}
      {user && (
        <Grid display="flex" width="100%" gap="8px">
          {!isMobileScreen || router.pathname === PAGE_PATHNAME.explore ? (
            <Grid>
              <EntityMenu user={user} />
            </Grid>
          ) : null}
          <GlobalSearch />
          <Grid display="flex" gap="14px" position="relative">
            {activeModalType ? (
              <HeaderItemWrapper ref={headerItemRef}>
                <HeaderItems type={activeModalType} onClose={() => setActiveModalType(null)} />
              </HeaderItemWrapper>
            ) : null}
            {!isMobile && <Wallet isActive={activeModalType === TYPES.WALLET || !activeModalType} />}
            <NotificationsBoard isActive={activeModalType === TYPES.NOTIFICATIONS || !activeModalType} />

            {showCreateButton && (
              <HeaderCreateButton
                highlighted="true"
                isActive={activeModalType === TYPES.CREATE_ENTITY || !activeModalType}
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
    prevProps.user?.id === nextProps.user?.id &&
    prevProps.orgsList?.every(
      (org, index) => org.id === nextProps.orgsList[index]?.id && org.isActive === nextProps.orgsList[index]?.isActive
    )
);
