import React from 'react';
import PlusIcon from 'components/Icons/plus';
import {
  SettingsHeaderBlock,
  SettingsHeaderContent,
  SettingsHeaderText,
  SettingsHeaderTitle,
  SettingsHeaderInviteButton,
  SettingsHeaderInviteButtonIcon,
} from './styles';

export function HeaderBlock(props) {
  const { title, description, icon, onInvite } = props;

  return (
    <SettingsHeaderBlock>
      <SettingsHeaderContent>
        <SettingsHeaderTitle>{title}</SettingsHeaderTitle>
        <SettingsHeaderText>{description}</SettingsHeaderText>
      </SettingsHeaderContent>
      {onInvite && (
        <SettingsHeaderInviteButton onClick={onInvite}>
          Invite
          <SettingsHeaderInviteButtonIcon>
            <PlusIcon fill="#FFFFFF" />
          </SettingsHeaderInviteButtonIcon>
        </SettingsHeaderInviteButton>
      )}
    </SettingsHeaderBlock>
  );
}
