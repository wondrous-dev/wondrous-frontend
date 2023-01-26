import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { logout, useMe } from 'components/Auth/withAuth';
import { UserProfilePictureGR15 } from 'components/Common/ProfilePictureHelpers';
import { PodsIconComponent } from 'components/Common/SidebarMainPods';
import LogoutIcon from 'components/Icons/logout';
import QuestionMarkIcon from 'components/Icons/questionMark.svg';
import GridViewIcon from 'components/Icons/Sidebar/gridView.svg';
import WrenchIcon from 'components/Icons/wrench';
import { UnstyledButton, UnstyledLink } from 'components/WorkspacePicker/styles';
import BANNER_IMAGE from 'public/images/profile/profile-banner.png';
import { SafeImage } from 'components/Common/Image';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { Wrapper } from '../CreateEntityComponent/styles';
import {
  ButtonIcon,
  GridIconWrapper,
  ImageWrapper,
  LinkWrapper,
  PageItemContainer,
  PageSelectorWrapper,
  ProfileInfo,
  UserContainer,
  UserHelperWrapper,
} from './styles';

const TutorialsButton = ({ onClick }) => (
  <UserHelperWrapper onClick={onClick}>
    <ButtonIcon bgColor={palette.grey75}>
      <QuestionMarkIcon />
    </ButtonIcon>
    <Typography color={palette.white} fontWeight={500} fontFamily={typography.fontFamily} fontSize="15px">
      Tutorials
    </Typography>
  </UserHelperWrapper>
);

const UserHelpers = ({ onClick, onClose }) => (
  <Grid display="flex" direction="column" gap="14px">
    <UnstyledLink href="/profile/settings" onClick={onClose}>
      <UserHelperWrapper>
        <ButtonIcon bgColor={palette.grey75}>
          <WrenchIcon />
        </ButtonIcon>
        <Typography color={palette.white} fontWeight={500} fontFamily={typography.fontFamily} fontSize="15px">
          My settings
        </Typography>
      </UserHelperWrapper>
    </UnstyledLink>
    <TutorialsButton onClick={onClick} />
    <UnstyledButton
      onClick={() => {
        onClose();
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

const UserProfile = ({ onClose, openPodModal, openTutorialsModal }) => {
  const user = useMe();

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
      component: <PodsIconComponent handleClick={openPodModal} isActive={false} />,
      type: 'component',
    },
  ];

  return (
    <Wrapper>
      <UnstyledLink href={`/profile/${user?.username}/about`} onClick={onClose}>
        <UserContainer>
          <ImageWrapper>
            <SafeImage fill alt="Profile banner" src={user?.headerPicture || BANNER_IMAGE} />
          </ImageWrapper>
          <ProfileInfo>
            <UserProfilePictureGR15
              isGr15Contributor={false}
              avatar={user?.profilePicture}
              style={{
                height: '72px',
                width: '72px',
                borderRadius: '100%',
              }}
            />
            <Typography color={palette.white} fontWeight={500} fontFamily={typography.fontFamily} fontSize="15px">
              {user?.username}
            </Typography>
          </ProfileInfo>
        </UserContainer>
      </UnstyledLink>
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
        <UserHelpers onClick={openTutorialsModal} onClose={onClose} />
      </div>
    </Wrapper>
  );
};

export default UserProfile;
