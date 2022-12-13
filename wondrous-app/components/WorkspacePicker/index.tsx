import Popover from '@mui/material/Popover';
import { OrgProfilePicture, UserProfilePicture } from 'components/Common/ProfilePictureHelpers';
import { useGlobalContext, useOrgBoard, usePodBoard } from 'utils/hooks';

import { useMutation } from '@apollo/client';
import Typography from '@mui/material/Typography';
import { ItemButtonIcon } from 'components/Common/SidebarItem/styles';
import AddDaoButton from 'components/Common/SidebarMainAddDao';
import { HorizontalEntityItem } from 'components/HeaderItems/CreateEntityComponent/styles';
import { ExplorePageMinimalIcon } from 'components/Icons/ExplorePageIcons';
import LogoutIcon from 'components/Icons/logout';
import PlusIcon from 'components/Icons/plus';
import { MuiDrawer } from 'components/Spotlight/styles';
import { LEAVE_ORG, LEAVE_POD } from 'graphql/mutations';
import useMediaQuery from 'hooks/useMediaQuery';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { PAGE_PATHNAME } from 'utils/constants';
import { FullWidthItem, ItemsWrapper, OrgItem, OrgWrapper, UnstyledButton, UnstyledLink, Wrapper } from './styles';

const LeaveWorkspace = ({ onClose }) => {
  const router = useRouter();
  const { pageData, orgsList } = useGlobalContext();

  const activeOrg = useMemo(() => orgsList.find((org) => org.isActive), [router.pathname, orgsList]);

  const activePod = pageData?.pod;

  const orgOrPod = activeOrg || activePod || {};

  const { name } = orgOrPod;

  const [leaveOrg] = useMutation(LEAVE_ORG, {
    onCompleted: () => {
      router.push('/mission-control');
      onClose();
    },
    refetchQueries: ['getUserOrgs'],
  });

  const [leavePod] = useMutation(LEAVE_POD, {
    onCompleted: () => {
      router.push('/mission-control');
      onClose();
    },
    refetchQueries: ['getUserPods'],
  });

  if (!activeOrg && !activePod) return null;

  const handleLeaveOrgClick = () => {
    const confirmed = confirm(`Are you sure you want to leave ${name}?`);
    if (!confirmed) {
      return;
    }
    leaveOrg({
      variables: {
        orgId: activeOrg?.id,
      },
    });
  };

  const handleLeavePodClick = () => {
    const confirmed = confirm(`Are you sure you want to leave ${name} pod?`);
    if (!confirmed) {
      return;
    }
    leavePod({
      variables: {
        podId: pageData?.pod?.id,
      },
    });
  };

  const action = activeOrg ? handleLeaveOrgClick : handleLeavePodClick;

  return (
    <UnstyledButton type="button" onClick={action}>
      <HorizontalEntityItem>
        <ItemButtonIcon style={{ padding: '4px' }} bgColor={palette.grey75}>
          <LogoutIcon />
        </ItemButtonIcon>

        <Typography color={palette.white} fontSize="15px" fontWeight={500} fontFamily={typography.fontFamily}>
          Leave {activeOrg ? 'Organization' : 'Pod'}
        </Typography>
      </HorizontalEntityItem>
    </UnstyledButton>
  );
};

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
    type: 'component',
    Component: ({ onClose }) => <LeaveWorkspace onClose={onClose} />,
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

  return (
    <Container open={open} onClose={onClose}>
      <Wrapper>
        <OrgWrapper gap="8px" display="flex" flexWrap="wrap" justifyContent="space-between">
          <FullWidthItem isActive={isUserBoard} href="/mission-control" onClick={onClose}>
            <UserProfilePicture
              avatar={user?.profilePicture}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '100%',
              }}
            />
            My workspace
          </FullWidthItem>
          {orgsList?.map((org, key) => (
            <OrgItem
              key={org?.id}
              isActive={org?.isActive}
              href={`/organization/${org?.username}/home`}
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
          ))}
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
