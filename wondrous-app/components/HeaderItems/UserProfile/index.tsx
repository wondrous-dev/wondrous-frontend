import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { logout, useMe } from 'components/Auth/withAuth';
import HelpModal from 'components/Common/HelpModal';
import { UserProfilePicture, UserProfilePictureGR15 } from 'components/Common/ProfilePictureHelpers';
import PodsIconButton from 'components/Common/SidebarMainPods';
import { PodsIconWrapper } from 'components/Common/SidebarMainPods/styles';
import { MissionControlIconWrapper } from 'components/Header/styles';
import LogoutIcon from 'components/Icons/logout';
import QuestionMarkIcon from 'components/Icons/questionMark.svg';
import { PodsIcon, TutorialsIcon } from 'components/Icons/sidebar';
import GridViewIcon from 'components/Icons/Sidebar/gridView.svg';
import WrenchIcon from 'components/Icons/wrench';
import { UnstyledButton, UnstyledLink } from 'components/WorkspacePicker/styles';
import Image from 'next/image';
import { useState } from 'react';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { Wrapper } from '../CreateEntityComponent/styles';
import {
  GridIconWrapper,
  ImageWrapper,
  ItemContainer,
  LinkWrapper,
  PageItemContainer,
  PageSelectorWrapper,
  ProfileInfo,
  UserContainer,
  UserHelperWrapper,
  ButtonIcon
} from './styles';

const TutorialsButton = () => {
  const [openHelpModal, setOpenHelpModal] = useState(false);
  return (
    <>
      {openHelpModal && <HelpModal open={openHelpModal} handleClose={() => setOpenHelpModal(false)} />}
      <UserHelperWrapper>
      <ButtonIcon bgColor={palette.grey75}>

        <QuestionMarkIcon />
        </ButtonIcon>
        <Typography color={palette.white} fontWeight={500} fontFamily={typography.fontFamily} fontSize="15px">
          Tutorials
        </Typography>
      </UserHelperWrapper>
    </>
  );
};

const PAGE_SELECTOR_CONFIG = [
  {
    label: 'My Work',
    key: 'my-work',
    Icon: (
      <GridIconWrapper>
        <GridViewIcon />
      </GridIconWrapper>
    ),
    href: '/dashboard',
  },
  {
    label: 'My Pods',
    key: 'my-pods',
    component: <PodsIconButton />,
    type: 'component',
  },
];

const USER_HELPERS = [
  {
    label: 'Your settings',
    key: 'settings',
    Icon: WrenchIcon,
    href: '/profile/settings',
  },
  {
    label: 'Tutorials',
    key: 'tutorails',
    component: TutorialsButton,
  },
  {
    label: 'Log out',
    key: 'log-out',
    Icon: LogoutIcon,
    action: logout,
  },
];

const UserHelpers = () => (
  <Grid display="flex" direction="column" gap="14px">
    <UnstyledLink href="/profile/settings">
      <UserHelperWrapper>
        <ButtonIcon bgColor={palette.grey75}>
          <WrenchIcon />
        </ButtonIcon>
        <Typography color={palette.white} fontWeight={500} fontFamily={typography.fontFamily} fontSize="15px">
          Your settings
        </Typography>
      </UserHelperWrapper>
    </UnstyledLink>
    <TutorialsButton />
    <UnstyledButton onClick={logout}>
      <UserHelperWrapper display="flex" gap="14px" justifyContent="flex-start" alignItems="center">
        <ButtonIcon bgColor={palette.grey75}>
          <LogoutIcon />
        </ButtonIcon>
        <Typography color={palette.white} fontWeight={500} fontFamily={typography.fontFamily} fontSize="15px">
          Log out
        </Typography>
      </UserHelperWrapper>
    </UnstyledButton>
  </Grid>
);

const UserProfile = () => {
  const user = useMe();

  return (
    <Wrapper>
      <UserContainer>
        <ImageWrapper>
          <Image fill alt="Profile banner" src="/images/profile/profile-banner.png" />
        </ImageWrapper>
        <ProfileInfo>
          <UserProfilePictureGR15
            isGr15Contributor={user?.checkIsGr15Contributor?.isGr15Contributor}
            avatar={user?.profilePicture}
            style={{
              height: '90px',
              width: '90px',
            }}
          />
          <Typography color={palette.white} fontWeight={500} fontFamily={typography.fontFamily} fontSize="15px">
            {user?.username}
          </Typography>
        </ProfileInfo>
      </UserContainer>
      <PageSelectorWrapper>
        {PAGE_SELECTOR_CONFIG.map((page, idx) => {
          if (page.type === 'component') {
            return page.component;
          }
          return (
            <LinkWrapper href={page.href} key={idx}>
              <PageItemContainer>
                {page.Icon}
                <Typography color={palette.white} fontWeight={500} fontFamily={typography.fontFamily} fontSize="15px">
                  {page.label}
                </Typography>
              </PageItemContainer>
            </LinkWrapper>
          );
        })}
      </PageSelectorWrapper>
      <div>
        <UserHelpers />
      </div>
    </Wrapper>
  );
};

export default UserProfile;
