import React from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

import GradientHeading from 'components/GradientHeading';
import Divider from 'components/Divider';
import palette from 'theme/palette';
import { LabelWrapper, OrgSearchButton } from 'components/OrgSearch/styles';
import { InlineText } from 'components/Common/Filter/styles';
import { OrgProfilePicture, UserProfilePicture } from 'components/Common/ProfilePictureHelpers';
import Dao2Dao from 'components/Icons/Dao2Dao';
import {
  ConfirmationStepWrapper,
  Description,
  Title,
} from 'components/CreateCollaborationModal/Steps/Confirmation/styles';

export const MODAL_TYPE = {
  VIEW: 'view',
  ACTION: 'action',
};

const CONTENT = {
  [MODAL_TYPE.VIEW]:
    'You have sent a collaboration request. You will be able to add your own members and tweak information after the invitee accepts.',
  [MODAL_TYPE.ACTION]:
    'You have received an invite. If you are happy to proceed, you will be able to add your own members and tweak information after approving the request.',
};

const CreatedBy = ({ username, profilePicture }) => (
  <Grid container direction="row" wrap="nowrap" gap="10px" alignItems="center">
    <UserProfilePicture avatar={profilePicture} />
    <Description>{username}</Description>
  </Grid>
);

const CollabDetails = ({ type, request }) => {
  const FIELDS = [
    {
      label: 'Title',
      component: () => <Title>{request.title}</Title>,
    },
    {
      label: 'Mission',
      component: () => <Description>{request.mission}</Description>,
    },
    {
      label: 'Request by',
      component: () => (
        <CreatedBy username={request.initiator.username} profilePicture={request.initiator.profilePicture} />
      ),
    },
  ];

  return (
    <ConfirmationStepWrapper>
      <GradientHeading fontSize={24} mb="20px">
        Project collaboration request
      </GradientHeading>
      <Typography sx={{ fontSize: '14px' }} color={palette.grey250}>
        {CONTENT[type]}
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
              profilePicture={request?.initiatorOrg?.profilePicture}
            />
            <span>{request?.initiatorOrg?.name}</span>
          </LabelWrapper>
        </OrgSearchButton>
        <Grid container sx={{ flex: '0 0 42px' }} justifyContent="center">
          <Dao2Dao />
        </Grid>
        <OrgSearchButton>
          <LabelWrapper>
            <OrgProfilePicture
              style={{ width: '42px', height: '42px' }}
              profilePicture={request?.recipientOrg.profilePicture}
            />
            <span>{request?.recipientOrg?.name}</span>
          </LabelWrapper>
        </OrgSearchButton>
      </Grid>
      <Divider my="18px" />
      <Grid container direction="column" sx={{ gap: '14px' }}>
        {FIELDS.map((field, idx) => (
          <Grid container direction="row" wrap="nowrap" key={idx}>
            <Box sx={{ flex: '0 0 110px' }}>
              <Box
                py="4px"
                px="8px"
                color="#CCBBFF"
                sx={{ background: '#282828', display: 'inline-block', fontWeight: '600' }}
                borderRadius="4px"
              >
                {field.label}
              </Box>
            </Box>
            <Box sx={{ width: '100%' }}>
              <field.component />
            </Box>
          </Grid>
        ))}
      </Grid>
    </ConfirmationStepWrapper>
  );
};

export default CollabDetails;
