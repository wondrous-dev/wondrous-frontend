import Link from 'next/link';
import { memo } from 'react';
import Box from '@mui/material/Box';

import Wallet from 'components/Common/Wallet';
import { CreateIconOutlined } from 'components/Icons/createBtn';
import { Button } from 'components/Common/button';
import NotificationsBoard from 'components/Notifications';
import Tooltip from 'components/Tooltip';
import HomeIcon from 'components/Icons/home';

import GlobalSearch from 'components/GlobalSearch';
import { User } from 'types/User';
import MissionControlIcon from 'components/Icons/MissionControlIcon';
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
  MissionControlIconWrapper,
} from './styles';

type Props = {
  isMobile: boolean;
  onLogoClick: () => unknown;
  onSignInClick: () => unknown;
  openCreateFormModal: () => unknown;
  showCreateButton: boolean;
  user: User | null;
};

const HeaderMemo = ({ isMobile, onLogoClick, onSignInClick, openCreateFormModal, showCreateButton, user }: Props) => (
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
        <Tooltip title="Mission Control">
          <Box>
            <Link passHref href="/mission-control">
              <MissionControlIconWrapper>
                <MissionControlIcon />
              </MissionControlIconWrapper>
            </Link>
          </Box>
        </Tooltip>

        {!isMobile && <GlobalSearch />}
      </HeaderLeftBlock>
      <HeaderRightBlock>
        {user && (
          <>
            {!isMobile && <Wallet />}
            <NotificationsBoard />
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
    prevProps.user?.id === nextProps.user?.id
);
