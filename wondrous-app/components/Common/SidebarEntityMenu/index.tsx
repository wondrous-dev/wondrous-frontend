import { useMutation } from '@apollo/client';

import { OrgProfilePicture } from 'components/Common/ProfilePictureHelpers';
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
import { LEAVE_ORG } from 'graphql/mutations';
import { useRouter } from 'next/router';
import { useState } from 'react';
import palette from 'theme/palette';
import { useBoards } from 'utils/hooks';
import useCanManage from '../../../hooks/useCanManage';

const EntityMenu = ({ name, id, thumbnailPicture, profilePicture }) => {
  const canManage = useCanManage();
  const { orgBoard } = useBoards();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const [leaveOrg] = useMutation(LEAVE_ORG, {
    onCompleted: () => {
      router.push('/mission-control');
    },
    refetchQueries: ['getUserOrgs'],
  });

  const handleLeaveOrgClick = () => {
    const confirmed = confirm('Are you sure you want to leave the organzation?');
    if (!confirmed) {
      return;
    }
    leaveOrg({
      variables: {
        orgId: id,
      },
    });
  };
  return (
    <>
      <Button onClick={handleClick} open={open} disabled={!canManage}>
        <IconText>
          <ButtonIcon>
            {orgBoard ? (
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
            )}
          </ButtonIcon>
          <Text>{name}</Text>
        </IconText>
        {canManage && <ArrowIcon open={open} />}
      </Button>
      <MenuStyled anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Item onClick={handleLeaveOrgClick}>Leave Organization</Item>
      </MenuStyled>
    </>
  );
};

export default EntityMenu;
