import { Close, Menu } from '@mui/icons-material';
import { memo, useMemo, useRef, useState } from 'react';

import { User } from 'types/User';

import { Backdrop } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Button } from 'components/Common/button';
import PodModal from 'components/Common/PodModal';
import EntityMenu from 'components/Common/SidebarEntityMenu';
import Wallet from 'components/Common/Wallet';
import GlobalSearch from 'components/GlobalSearch';
import HeaderItems, { TYPES } from 'components/HeaderItems';
import HeaderUserProfile from 'components/HeaderUserProfile';
import { CreateIconOutlined } from 'components/Icons/createBtn';
import NotificationsBoard from 'components/Notifications';
import useMediaQuery from 'hooks/useMediaQuery';
import useSideBar from 'hooks/useSideBar';
import { useRouter } from 'next/router';
import { useHotkeys } from 'react-hotkeys-hook';
import { Org } from 'types/Org';
import { PAGE_PATHNAME } from 'utils/constants';
import { useOutsideAlerter } from 'utils/hooks';
import { HOTKEYS } from 'utils/hotkeyHelper';
import BreadCrumbs from 'components/BreadCrumbs';
import { HeaderBar, HeaderCreateButton, HeaderItemWrapper, MenuContainer } from './styles';

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

const ACTIVE_MODAL_TYPES_WITH_COMPONENTS = [TYPES.WALLET, TYPES.CREATE_ENTITY, TYPES.PROFILE];

const HeaderMemo = ({ isMobile, onSignInClick, showCreateButton, user }: Props) => {
  const { setMinimized, minimized } = useSideBar();
  const { isMobileScreen } = useMediaQuery();
  const [isPodModalOpen, setIsPodModalOpen] = useState(false);
  const headerItemRef = useRef();
  const wrapperRef = useRef();
  const [activeModalType, setActiveModalType] = useState<TYPES | null>(null);
  const router = useRouter();
  const toggleMinimize = () => setMinimized((prev) => !prev);

  useOutsideAlerter(wrapperRef, () => setActiveModalType(null));

  const handleActiveModalType = (type: TYPES) => {
    setActiveModalType((prev) => (prev === type ? null : type));
    if (!minimized && isMobileScreen) setMinimized(true);
  };

  const displayCustomHeaderItem = useMemo(
    () => ACTIVE_MODAL_TYPES_WITH_COMPONENTS.includes(activeModalType),
    [activeModalType]
  );

  useHotkeys(HOTKEYS.OPEN_PODS, () => {
    setIsPodModalOpen(true);
  });

  useHotkeys(HOTKEYS.OPEN_MISSION_CONTROL, () => {
    router.push('/mission-control');
  });

  return (
    <>
      <PodModal open={isPodModalOpen} handleClose={() => setIsPodModalOpen(false)} />

      <HeaderBar minimized={minimized}>
        <Backdrop open={!!activeModalType && isMobileScreen} />
        {/* <div style={{height: '30px', width: '30px', color: 'white', background: 'red'}}>hello</div> */}
        {isMobile && router.pathname !== PAGE_PATHNAME.explore ? (
          <MenuContainer onClick={toggleMinimize}>{!minimized ? <Close /> : <Menu />}</MenuContainer>
        ) : null}
        {user && (
          <Grid display="flex" width="100%" gap="14px">
            {!isMobileScreen || router.pathname === PAGE_PATHNAME.explore ? (
              // 192px is the width of the sidebar - sidebar styles width - 14px (padding)
              <Grid maxWidth="192px">
                <EntityMenu />
              </Grid>
            ) : null}
            <BreadCrumbs />
            <Grid display="flex" gap="14px" position="relative" ref={activeModalType ? wrapperRef : null}>
              {displayCustomHeaderItem ? (
                <HeaderItemWrapper ref={headerItemRef}>
                  <HeaderItems type={activeModalType} onClose={() => setActiveModalType(null)} />
                </HeaderItemWrapper>
              ) : null}
              <GlobalSearch />
              {!isMobile && (
                <Wallet
                  isActive={activeModalType === TYPES.WALLET || !activeModalType}
                  handleClick={() => handleActiveModalType(TYPES.WALLET)}
                />
              )}
              <NotificationsBoard
                setIsActive={() => handleActiveModalType(TYPES.NOTIFICATIONS)}
                isActive={activeModalType === TYPES.NOTIFICATIONS || !activeModalType}
                ref={headerItemRef}
                isOpen={activeModalType === TYPES.NOTIFICATIONS}
              />
              <HeaderUserProfile
                handleClick={() => handleActiveModalType(TYPES.PROFILE)}
                open={activeModalType === TYPES.PROFILE}
                isActive={activeModalType === TYPES.PROFILE || !activeModalType}
              />
              {showCreateButton && (
                <HeaderCreateButton
                  id="tour-header-create-btn"
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
    </>
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
