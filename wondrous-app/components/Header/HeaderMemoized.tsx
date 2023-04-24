import { Close, Menu } from '@mui/icons-material';
import { memo, useMemo, useRef, useState } from 'react';

import { User } from 'types/User';

import { Backdrop } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Button } from 'components/Common/button';
import HelpModal from 'components/Common/HelpModal.jsx';
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
import { Org } from 'types/Org';
import { PAGE_PATHNAME, PAGES_WITH_NO_HOTKEYS } from 'utils/constants';
import { useHotKeysListener, useOutsideAlerter } from 'utils/hooks';
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
  const [isTutorialsModalOpen, setIsTutorialsModalOpen] = useState(false);
  const headerItemRef = useRef();
  const wrapperRef = useRef();
  const [activeModalType, setActiveModalType] = useState<TYPES | null>(null);
  const router = useRouter();
  const toggleMinimize = () => setMinimized((prev) => !prev);
  useOutsideAlerter(wrapperRef, () => {
    if (isPodModalOpen || isTutorialsModalOpen) return;
    setActiveModalType(null);
  });

  const handleActiveModalType = (type: TYPES) => {
    setActiveModalType((prev) => (prev === type ? null : type));
    if (!minimized && isMobileScreen) setMinimized(true);
  };

  const displayCustomHeaderItem = useMemo(
    () => ACTIVE_MODAL_TYPES_WITH_COMPONENTS.includes(activeModalType),
    [activeModalType]
  );

  useHotKeysListener(HOTKEYS.OPEN_PODS, () => {
    setIsPodModalOpen(true);
  });

  useHotKeysListener(HOTKEYS.OPEN_MISSION_CONTROL, () => {
    router.push('/mission-control');
  });

  const handleClosePodModal = () => {
    setIsPodModalOpen(false);
    if (activeModalType) {
      setActiveModalType(null);
    }
  };

  const handleCloseTutorialsModal = () => {
    setIsTutorialsModalOpen(false);
    if (activeModalType) {
      setActiveModalType(null);
    }
  };

  return (
    <>
      <PodModal open={isPodModalOpen} handleClose={handleClosePodModal} />
      <HelpModal open={isTutorialsModalOpen} handleClose={handleCloseTutorialsModal} />
      <HeaderBar>
        <Backdrop open={!!activeModalType && isMobileScreen} />
        {/* <div style={{height: '30px', width: '30px', color: 'white', background: 'red'}}>hello</div> */}
        {isMobile && router.pathname !== PAGE_PATHNAME.explore ? (
          <MenuContainer onClick={toggleMinimize}>{!minimized ? <Close /> : <Menu />}</MenuContainer>
        ) : null}
        {user && (
          <Grid display="flex" width="100%" gap="14px">
            {!isMobileScreen || router.pathname === PAGE_PATHNAME.explore ? (
              // 192px is the width of the sidebar - sidebar styles width - 14px (padding)
              <Grid maxWidth="192px" height="fit-content">
                <EntityMenu />
              </Grid>
            ) : null}
            {isMobileScreen ? null : <BreadCrumbs />}
            <GlobalSearch />
            <Grid
              display="flex"
              gap="14px"
              position="relative"
              width="fit-content"
              justifyContent="end"
              ref={activeModalType ? wrapperRef : null}
            >
              {displayCustomHeaderItem ? (
                <HeaderItemWrapper ref={headerItemRef}>
                  <HeaderItems
                    type={activeModalType}
                    onClose={() => setActiveModalType(null)}
                    openPodModal={() => setIsPodModalOpen(true)}
                    openTutorialsModal={() => setIsTutorialsModalOpen(true)}
                  />
                </HeaderItemWrapper>
              ) : null}
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
                  <CreateIconOutlined id="tour-header-create-btn" height="36px" width="36px" />
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
