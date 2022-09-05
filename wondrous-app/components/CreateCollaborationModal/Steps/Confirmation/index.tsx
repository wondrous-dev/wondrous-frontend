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

const MEMBER_DISPLAY_LIMIT = 2;

type Props = {
  onCancel: () => void;
  onSubmit: () => void | Promise<any>;
  footerRef: React.RefObject<HTMLDivElement>;
  collabDetails: {
    mission?: string;
    org1?: Org;
    org2?: Org;
    step?: number;
    title?: string;
    users?: {
      admins: Array<User>;
      members: Array<User>;
    };
  };
  deleteMember: (userId: string) => void;
};

const Step3Confirmation = ({ onSubmit, onCancel, footerRef, collabDetails, deleteMember }: Props) => {
  const [isMembersModalOpen, setMembersModalOpen] = useState(false);

  const handleModal = () => setMembersModalOpen((prevState) => !prevState);

  return (
    <ConfirmationStepWrapper>
      <MembersModal
        open={isMembersModalOpen}
        onClose={handleModal}
        members={collabDetails?.users?.members}
        deleteMember={deleteMember}
      />
      <GradientHeading fontSize={24} mb="20px">
        Confirm details
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
        <OrgSearchButton>
          <LabelWrapper>
            <OrgProfilePicture
              style={{ width: '42px', height: '42px' }}
              profilePicture={collabDetails?.org1?.profilePicture}
            />
            <span>{collabDetails?.org1?.name}</span>
          </LabelWrapper>
        </OrgSearchButton>
        <Grid container sx={{ flex: '0 0 42px' }} justifyContent="center">
          <Dao2Dao />
        </Grid>
        <OrgSearchButton>
          <LabelWrapper>
            <OrgProfilePicture
              style={{ width: '42px', height: '42px' }}
              profilePicture={collabDetails?.org2.profilePicture}
            />
            <span>{collabDetails?.org2?.name}</span>
          </LabelWrapper>
        </OrgSearchButton>
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
          <Box sx={{ width: '100%' }}>
            <Title>{collabDetails.title}</Title>
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
              Mission
            </Box>
          </Box>

          <Box sx={{ width: '100%' }}>
            <Description>{collabDetails.mission}</Description>
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
              {collabDetails?.users.admins?.map((admin, idx) => (
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
              {collabDetails?.users?.members?.slice(0, MEMBER_DISPLAY_LIMIT).map((member, idx) => (
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
                    />
                  ) : (
                    <CreateEntityDefaultUserImage />
                  )}
                </SelectedMembersItem>
              ))}
              {collabDetails?.users?.members?.length > MEMBER_DISPLAY_LIMIT && (
                <MembersDisplayAll withRightMargin onClick={handleModal}>
                  +{collabDetails?.users?.members?.length - MEMBER_DISPLAY_LIMIT} more
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
              <Button color="primary" type="submit" onClick={onSubmit}>
                Send invitation
              </Button>
            </Grid>,
            footerRef.current
          )
        : null}
    </ConfirmationStepWrapper>
  );
};

export default Step3Confirmation;
