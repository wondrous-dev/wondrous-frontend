import React from 'react';
import PlusIcon from 'components/Icons/plus';
import {
  SettingsHeaderBlock,
  SettingsHeaderContent,
  SettingsHeaderText,
  SettingsHeaderTitle,
  SettingsHeaderInviteButton,
  SettingsHeaderInviteButtonIcon,
  SettingsHeaderAction,
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
      <SettingsHeaderAction>
        {!!onInvite && <SettingsHeaderInviteButton onClick={onInvite}>Invite</SettingsHeaderInviteButton>}
        {!!handleDownloadToCSV && (
          <SettingsHeaderActionText onClick={handleDownloadToCSV}>Download to CSV</SettingsHeaderActionText>
        )}
      </SettingsHeaderAction>
    </SettingsHeaderBlock>
  );
}
