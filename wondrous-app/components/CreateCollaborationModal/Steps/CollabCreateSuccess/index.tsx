import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import GradientHeading from 'components/GradientHeading';
import palette from 'theme/palette';
import { OrgProfilePicture } from 'components/Common/ProfilePictureHelpers';
import { LabelWrapper, OrgSearchButton } from 'components/OrgSearch/styles';
import typography from 'theme/typography';
import { InlineText } from 'components/Common/Filter/styles';
import { ConfirmationStepWrapper } from '../Confirmation/styles';
import { OrgSeparator } from './styles';

const CollabCreateSuccess = ({ request }) => (
  <ConfirmationStepWrapper>
    <Grid container direction="column" alignItems="center" gap="10px">
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent="center"
        wrap="nowrap"
        gap="10px"
        sx={{
          [InlineText]: {
            maxWidth: '154px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        }}
      >
        <LabelWrapper>
          <OrgProfilePicture
            style={{ width: '42px', height: '42px' }}
            profilePicture={request?.initiatorOrg?.profilePicture}
          />
          <Typography color={palette.white} fontWeight={700} fontSize={20} fontFamily={typography.fontFamily}>
            {request?.initiatorOrg?.name}
          </Typography>
        </LabelWrapper>
        <Grid container sx={{ flex: '0 0 42px' }} justifyContent="center">
          <OrgSeparator>X</OrgSeparator>
        </Grid>
        <LabelWrapper>
          <OrgProfilePicture
            style={{ width: '42px', height: '42px' }}
            profilePicture={request?.recipientOrg.profilePicture}
          />
          <Typography color={palette.white} fontWeight={700} fontSize={20} fontFamily={typography.fontFamily}>
            {request?.recipientOrg?.name}
          </Typography>
        </LabelWrapper>
      </Grid>

      <GradientHeading fontSize={24} mb="20px" textAlign="center">
        The collab workspace is now open!
      </GradientHeading>

      <Typography color={palette.grey250} fontSize={14}>
        Import members from your project to this collaboration. After, you will get an invite link to add their project
        lead to add their team.
      </Typography>
    </Grid>
  </ConfirmationStepWrapper>
);

export default CollabCreateSuccess;
