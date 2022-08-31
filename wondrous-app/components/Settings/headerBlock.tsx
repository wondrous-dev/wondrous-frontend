import React from 'react';
import PlusIcon from 'components/Icons/plus';
import { Grid } from '@mui/material';
import {
  SettingsHeaderBlock,
  SettingsHeaderContent,
  SettingsHeaderText,
  SettingsHeaderTitle,
  SettingsHeaderInviteButton,
  SettingsHeaderInviteButtonIcon,
  SettingsHeaderActionText,
} from './styles';

export function HeaderBlock(props) {
  const { title, description, icon, onInvite, handleDownloadToCSV } = props;

  return (
    <SettingsHeaderBlock>
      <SettingsHeaderContent>
        <SettingsHeaderTitle>{title}</SettingsHeaderTitle>
        <SettingsHeaderText>{description}</SettingsHeaderText>
      </SettingsHeaderContent>
      <Grid display="flex" flexDirection="column" alignItems="flex-end" gap="17px">
        {!!onInvite && <SettingsHeaderInviteButton onClick={onInvite}>Invite</SettingsHeaderInviteButton>}
        {!!handleDownloadToCSV && (
          <SettingsHeaderActionText onClick={handleDownloadToCSV}>Download to CSV</SettingsHeaderActionText>
        )}
      </Grid>
    </SettingsHeaderBlock>
  );
}
