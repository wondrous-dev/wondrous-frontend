import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { createPortal } from 'react-dom';
import Grid from '@mui/material/Grid';

import GradientHeading from 'components/GradientHeading';
import Divider from 'components/Divider';
import { Button } from 'components/Button';
import palette from 'theme/palette';
import { Org } from 'types/Org';
import { User } from 'types/User';
import { LabelWrapper, OrgSearchButton } from 'components/OrgSearch/styles';
import { InlineText } from 'components/Common/Filter/styles';
import { OrgProfilePicture } from 'components/Common/ProfilePictureHelpers';
import Dao2Dao from 'components/Icons/Dao2Dao';
import { SafeImage } from 'components/Common/Image';
import { CreateEntityDefaultUserImage } from 'components/CreateEntity/CreateEntityModal/styles';
import {
  SelectedUserItem,
  SelectedUsersWrapper,
} from 'components/CreateCollaborationModal/Steps/AddTeamMembers/styles';
import MembersModal from './MembersModal';
import {
  ConfirmationStepWrapper,
  Description,
  Title,
  SelectedMembersWrapper,
  SelectedMembersItem,
  MembersDisplayAll,
} from './styles';

const MEMBER_DISPLAY_LIMIT = 6;

type Props = {
  onCancel: () => void;
  onSubmit: (users) => void | Promise<any>;
  footerRef: React.RefObject<HTMLDivElement>;
  collabDetails: Org;
  selectedUsers?: {
    admins: Array<User>;
    members: Array<User>;
    adminRole: string;
    memberRole: string;
  };
  deleteMember: (userId: string) => void;
  parentOrgs: Array<Org>;
};

const AddMembersConfirmation = ({
  onSubmit,
  onCancel,
  footerRef,
  collabDetails,
  deleteMember,
  selectedUsers,
  parentOrgs,
}: Props) => {
  const [isMembersModalOpen, setMembersModalOpen] = useState(false);

  const handleModal = () => setMembersModalOpen((prevState) => !prevState);

  return (
    <ConfirmationStepWrapper>
      <MembersModal
        open={isMembersModalOpen}
        onClose={handleModal}
        members={selectedUsers?.members}
        deleteMember={deleteMember}
      />
      <GradientHeading fontSize={24} mb="20px">
        Confirm members list
      </GradientHeading>

      <Typography color={palette.grey250}>
        Confirm your Project Collaboration details look right. Once you confirm, we will give you a link to send to
        their collaboration leader.
      </Typography>

      <Divider my="18px" />
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
        wrap="nowrap"
        sx={{
          [InlineText]: {
            maxWidth: '154px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        }}
      >
        {parentOrgs?.map((org, idx) => (
          <>
            <OrgSearchButton key={idx}>
              <LabelWrapper>
                <OrgProfilePicture style={{ width: '42px', height: '42px' }} profilePicture={org?.profilePicture} />
                <span>{org.name}</span>
              </LabelWrapper>
            </OrgSearchButton>
            {idx < parentOrgs.length - 1 && (
              <Grid container sx={{ flex: '0 0 42px' }} justifyContent="center">
                <Dao2Dao />
              </Grid>
            )}
          </>
        ))}
      </Grid>
      <Divider my="18px" />
      <Grid container direction="column" sx={{ gap: '14px' }}>
        <Grid container direction="row" wrap="nowrap">
          <Box sx={{ flex: '0 0 94px' }}>
            <Box
              py="4px"
              px="8px"
              color="#CCBBFF"
              sx={{ background: '#282828', display: 'inline-block', fontWeight: '600' }}
              borderRadius="4px"
            >
              Title
            </Box>
          </Box>
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
            <Title>{collabDetails.name}</Title>
          </Box>
        </Grid>
      </Grid>
      <Divider my="18px" />
      <Grid container direction="column" sx={{ gap: '14px' }}>
        <Grid container direction="row" wrap="nowrap">
          <Box sx={{ flex: '0 0 94px' }}>
            <Box
              py="4px"
              px="8px"
              color="#CCBBFF"
              sx={{ background: '#282828', display: 'inline-block', fontWeight: '600' }}
              borderRadius="4px"
            >
              Admins
            </Box>
          </Box>
          <Box sx={{ width: '100%' }}>
            <SelectedUsersWrapper>
              {selectedUsers.admins?.map((admin, idx) => (
                <SelectedUserItem key={idx}>
                  {admin?.profilePicture ? (
                    <SafeImage
                      useNextImage={false}
                      src={admin?.profilePicture}
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                      }}
                      alt="Profile picture"
                    />
                  ) : (
                    <CreateEntityDefaultUserImage />
                  )}
                  {admin?.username}
                </SelectedUserItem>
              ))}
            </SelectedUsersWrapper>
          </Box>
        </Grid>
        <Grid container direction="row" wrap="nowrap">
          <Box sx={{ flex: '0 0 94px' }}>
            <Box
              py="4px"
              px="8px"
              color="#CCBBFF"
              sx={{ background: '#282828', display: 'inline-block', fontWeight: '600' }}
              borderRadius="4px"
            >
              Members
            </Box>
          </Box>
          <Box sx={{ width: '100%' }}>
            <SelectedMembersWrapper>
              {selectedUsers?.members?.slice(0, MEMBER_DISPLAY_LIMIT).map((member, idx) => (
                <SelectedMembersItem key={idx} withRightMargin={idx > 0}>
                  {member?.profilePicture ? (
                    <SafeImage
                      useNextImage={false}
                      src={member?.profilePicture}
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                      }}
                      alt="Profile picture"
                    />
                  ) : (
                    <CreateEntityDefaultUserImage />
                  )}
                </SelectedMembersItem>
              ))}
              {selectedUsers?.members?.length > MEMBER_DISPLAY_LIMIT && (
                <MembersDisplayAll withRightMargin onClick={handleModal}>
                  +{selectedUsers?.members?.length - MEMBER_DISPLAY_LIMIT} more
                </MembersDisplayAll>
              )}
            </SelectedMembersWrapper>
          </Box>
        </Grid>
      </Grid>
      <Divider my="18px" />
      <Grid container>
        <Box>
          <Box
            py="4px"
            px="8px"
            color="#CCBBFF"
            sx={{ background: '#282828', display: 'flex', flexDirection: 'column', gap: '12px', fontWeight: '600' }}
            borderRadius="4px"
          >
            What happens next?
            <Description>
              Wonderverse will receive an invitation. They will be able to add their own team to this collaboration.
              Once they accept, the workspace will activate.
            </Description>
          </Box>
        </Box>
      </Grid>
      {footerRef.current
        ? createPortal(
            <Grid container gap="18px">
              <Button color="grey" onClick={onCancel}>
                Cancel
              </Button>
              <Button color="primary" type="submit" onClick={() => onSubmit(selectedUsers)}>
                Add members
              </Button>
            </Grid>,
            footerRef.current
          )
        : null}
    </ConfirmationStepWrapper>
  );
};

export default AddMembersConfirmation;
