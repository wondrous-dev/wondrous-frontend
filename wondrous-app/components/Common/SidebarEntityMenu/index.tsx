import { OrgProfilePicture, UserProfilePicture } from 'components/Common/ProfilePictureHelpers';
import { useMutation } from '@apollo/client';

import {
  ArrowIcon,
  Button,
  ButtonIcon,
  IconText,
  Item,
  MenuStyled,
  NoLogoPod,
  Text,
} from 'components/Common/SidebarEntityMenu/styles';
import { ExplorePageMinimalIcon } from 'components/Icons/ExplorePageIcons';
import WorkspacePicker from 'components/WorkspacePicker';
import { LEAVE_ORG, LEAVE_POD } from 'graphql/mutations';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import palette from 'theme/palette';
import { useGlobalContext } from 'utils/hooks';
import {IconWrapper} from './styles'

const EntityMenu = ({ user, activePod = null }) => {
  const router = useRouter()
  const {orgsList} = useGlobalContext()

  const activeOrg = useMemo(() => orgsList.find((org) => org.isActive), [router.pathname, orgsList]);

  const orgOrPod = activeOrg || activePod || {};

  const { thumbnailPicture, profilePicture, name, id } = orgOrPod;

  const isExplore = useMemo(() => router.pathname.includes('/explore'), [router.pathname]);

  const isOrg = useMemo(() => router.pathname.includes('/organization'), [router.pathname]);

  const isUserBoard = useMemo(() => !isExplore && !activeOrg && !activePod, [router.pathname, isExplore, activeOrg, activePod]);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  let pageTitle = useMemo(() => {
    if (isExplore) {
      return 'Explore';
    }
    if (isUserBoard) {
      return 'My workspace';
    }
    if (isOrg) {
      return name;
    }
  }, [name, isExplore, isUserBoard, isOrg]);

  const [leaveOrg] = useMutation(LEAVE_ORG, {
    onCompleted: () => {
      router.push('/mission-control');
    },
    refetchQueries: ['getUserOrgs'],
  });

  const [leavePod] = useMutation(LEAVE_POD, {
    onCompleted: () => {
      router.push('/mission-control');
    },
    refetchQueries: ['getUserPods'],
  });

  const handleLeaveOrgClick = () => {
    const confirmed = confirm(`Are you sure you want to leave ${name}?`);
    if (!confirmed) {
      return;
    }
    leaveOrg({
      variables: {
        orgId: id,
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
        podId: id,
      },
    });
  };
  return (
    <>
      <Button onClick={handleClick} open={open}>
        <IconText>
          <ButtonIcon isUserBoard={isUserBoard}>
            {isOrg ? (
              <OrgProfilePicture
                profilePicture={thumbnailPicture || profilePicture}
                style={{
                  borderRadius: '3px',
                  width: '28px',
                  height: '28px',
                  background: palette.grey87,
                }}
              />
            ) : null}
            {activePod ? <NoLogoPod /> : null}
            {isUserBoard ? (
              <UserProfilePicture
                avatar={user?.profilePicture}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '100%'
                }}
              />
            ) : null}
            {isExplore ? <IconWrapper>
              
              <ExplorePageMinimalIcon /> </IconWrapper>: null}
            {/* {isOrg ? (
              <OrgProfilePicture
                profilePicture={thumbnailPicture || profilePicture}
                style={{
                  borderRadius: '3px',
                  width: '28px',
                  height: '28px',
                  background: palette.grey87,
                }}
              />
            ) : (
              <NoLogoPod />
            )} */}
          </ButtonIcon>
          <Text>{pageTitle}</Text>
        </IconText>
        <ArrowIcon open={open} />
      </Button>
      <WorkspacePicker user={user} isUserBoard={isUserBoard} open={open} anchorEl={anchorEl} onClose={handleClose} />
      {/* <MenuStyled anchorEl={anchorEl} open={open} onClose={handleClose}> */}
        {/* {podBoard && <Item onClick={handleLeavePodClick}>Leave Pod</Item>}
        {orgBoard && <Item onClick={handleLeaveOrgClick}>Leave Organization</Item>} */}
      {/* </MenuStyled> */}
    </>
  );
};

export default EntityMenu;
