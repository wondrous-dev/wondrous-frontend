import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { logout, useMe } from 'components/Auth/withAuth';
import HelpModal from 'components/Common/HelpModal.jsx';
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
  ButtonIcon,
  GridIconWrapper,
  ImageWrapper,
  ItemContainer,
  LinkWrapper,
  PageItemContainer,
  PageSelectorWrapper,
  ProfileInfo,
  UserContainer,
  UserHelperWrapper,
} from './styles';

const TutorialsButton = ({ onClick }) => {
  const [openHelpModal, setOpenHelpModal] = useState(false);

  const handleClick = () => {
    setOpenHelpModal(true);
    // onClick()
  };
  return (
    <>
      {openHelpModal && <HelpModal open={openHelpModal} handleClose={() => setOpenHelpModal(false)} />}
      <UserHelperWrapper onClick={handleClick}>
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
    href: '/mission-control',
  },
  {
    label: 'My Pods',
    key: 'my-pods',
    component: <PodsIconButton />,
    type: 'component',
  },
];
const UserHelpers = ({ onClick }) => (
  <Grid display="flex" direction="column" gap="14px">
    <UnstyledLink href="/profile/settings" onClick={onClick}>
      <UserHelperWrapper>
        <ButtonIcon bgColor={palette.grey75}>
          <WrenchIcon />
        </ButtonIcon>
        <Typography color={palette.white} fontWeight={500} fontFamily={typography.fontFamily} fontSize="15px">
          Your settings
        </Typography>
      </UserHelperWrapper>
    </UnstyledLink>
    <TutorialsButton onClick={onClick} />
    <UnstyledButton
      onClick={() => {
        onClick();
        logout();
      }}
    >
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

const UserProfile = ({ onClose }) => {
  const user = useMe();

  return (
    <Wrapper>
      <UserContainer>
        <ImageWrapper>
          <Image fill alt="Profile banner" src="/images/profile/profile-banner.png" />
        </ImageWrapper>
        <UnstyledLink href={`/profile/${user?.username}/about`} onClick={onClose}>
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
        </UnstyledLink>
      </UserContainer>
      <PageSelectorWrapper>
        {PAGE_SELECTOR_CONFIG.map((page, idx) => {
          if (page.type === 'component') {
            return page.component;
          }
          return (
            <LinkWrapper href={page.href} key={idx} onClick={onClose}>
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
        <UserHelpers onClick={onClose} />
      </div>
    </Wrapper>
  );
};

export default UserProfile;
