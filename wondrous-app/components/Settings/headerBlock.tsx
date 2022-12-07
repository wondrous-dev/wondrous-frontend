import React from 'react';
import { Grid } from '@mui/material';
import {
  SettingsHeaderBlock,
  SettingsHeaderContent,
  SettingsHeaderText,
  SettingsHeaderTitle,
  SettingsHeaderInviteButton,
  SettingsHeaderActionText,
} from './styles';

function HeaderBlock(props) {
  const { title, description, onInvite, handleDownloadToCSV } = props;

  return (
    <SettingsHeaderBlock>
      <SettingsHeaderContent>
        <SettingsHeaderTitle>{title}</SettingsHeaderTitle>
        <SettingsHeaderText>{description}</SettingsHeaderText>
      </SettingsHeaderContent>
      <Grid
        display="flex"
        flexDirection={{ md: 'column', sm: 'row', xs: 'row' }}
        width="100%"
        alignItems={{ md: 'flex-end', sm: 'center', xs: 'center' }}
        gap="17px"
        mt={{ md: 0, sm: '32px', xs: '32px' }}
      >
        {!!onInvite && <SettingsHeaderInviteButton onClick={onInvite}>Invite</SettingsHeaderInviteButton>}
        {!!handleDownloadToCSV && (
          <SettingsHeaderActionText onClick={handleDownloadToCSV}>Download to CSV</SettingsHeaderActionText>
        )}
      </Grid>
    </SettingsHeaderBlock>
  );
}

export default HeaderBlock;
