import Popover from '@mui/material/Popover';
import { useGlobalContext } from 'utils/hooks';
import { OrgProfilePicture, UserProfilePicture } from 'components/Common/ProfilePictureHelpers';

import { Wrapper, OrgItem, OrgWrapper, ItemsWrapper, UnstyledButton, UnstyledLink, FullWidthItem } from './styles';
import palette from 'theme/palette';
import PlusIcon from 'components/Icons/plus';
import { ExplorePageMinimalIcon } from 'components/Icons/ExplorePageIcons';
import { HorizontalEntityItem } from 'components/HeaderItems/styles';
import { ItemButtonIcon } from 'components/Common/SidebarItem/styles';
import typography from 'theme/typography';
import Typography from '@mui/material/Typography';
import OrgSettingsIcon from 'components/Icons/OrgSettingsIcon';
import { PAGE_PATHNAME } from 'utils/constants';
import AddDaoButton from 'components/Common/SidebarMainAddDao';
import useMediaQuery from 'hooks/useMediaQuery';
import { MuiDrawer } from 'components/Spotlight/styles';
import { useMemo } from 'react';

const ITEMS_CONFIG = [
  {
    type: 'component',
    Component: ({ onClose }) => (
      <AddDaoButton
        renderButton={({ handleCreateDaoModal }) => (
          <UnstyledButton
            type="button"
            onClick={() => {
              handleCreateDaoModal();
              onClose();
            }}
          >
            <HorizontalEntityItem>
              <ItemButtonIcon bgColor={palette.grey75}>
                <PlusIcon />
              </ItemButtonIcon>

              <Typography color={palette.white} fontSize="15px" fontWeight={500} fontFamily={typography.fontFamily}>
                Create New Project
              </Typography>
            </HorizontalEntityItem>
          </UnstyledButton>
        )}
      />
    ),
  },
  {
    label: 'Explore Projects',
    Icon: ExplorePageMinimalIcon,
    type: 'link',
    url: PAGE_PATHNAME.explore,
  },
  {
    label: 'Settings',
    Icon: OrgSettingsIcon,
    type: 'link',
    url: '/profile/settings',
  },
];

const TYPE_TO_COMPONENT = {
  button: UnstyledButton,
  link: UnstyledLink,
};

const WorkspacePicker = ({ open, anchorEl, onClose, isUserBoard = false, user }) => {
  const { orgsList } = useGlobalContext();
  const { isMobileScreen } = useMediaQuery();

  const Container = useMemo(
    () =>
      isMobileScreen
        ? ({ open, onClose, children }) => (
            <MuiDrawer anchor="bottom" open={open} onClose={onClose}>
              {children}
            </MuiDrawer>
          )
        : ({ children, open, onClose }) => (
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={onClose}
              sx={{
                '& .MuiPopover-paper': {
                  borderRadius: '6px',
                  border: `1px solid ${palette.grey79}`,
                },
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              {children}
            </Popover>
          ),
    [isMobileScreen, anchorEl]
  );

  console.log(orgsList, 'orgsList');

  return (
    <Container open={open} onClose={onClose}>
      <Wrapper>
        <OrgWrapper gap="8px" display="flex" flexWrap="wrap" justifyContent="space-between">
          <FullWidthItem isActive={isUserBoard} href={`/dashboard`} onClick={onClose}>
            <UserProfilePicture
              avatar={user?.profilePicture}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '100%'
              }}
            />
            My workspace
          </FullWidthItem>
          {orgsList?.map((org, key) => {
            return (
              <OrgItem
                key={org?.id}
                isActive={org?.isActive}
                href={`/organization/${org?.username}/project`}
                onClick={onClose}
              >
                <OrgProfilePicture
                  profilePicture={org?.profilePicture}
                  style={{
                    borderRadius: '3px',
                    width: '28px',
                    height: '28px',
                  }}
                />
                {org?.name}
              </OrgItem>
            );
          })}
        </OrgWrapper>
        <ItemsWrapper>
          {ITEMS_CONFIG?.map(({ Icon, label, type, url, Component }, key) => {
            if (type === 'component') return <Component key={key} onClose={onClose} />;

            const Wrapper = TYPE_TO_COMPONENT[type];

            const wrapperProps = url ? { href: url } : {};

            return (
              <Wrapper {...wrapperProps} onClick={onClose}>
                <HorizontalEntityItem key={key}>
                  <ItemButtonIcon bgColor={palette.grey75}>
                    <Icon />
                  </ItemButtonIcon>

                  <Typography color={palette.white} fontSize="15px" fontWeight={500} fontFamily={typography.fontFamily}>
                    {label}
                  </Typography>
                </HorizontalEntityItem>
              </Wrapper>
            );
          })}
        </ItemsWrapper>
      </Wrapper>
    </Container>
  );
};

export default WorkspacePicker;
