import React from 'react';
import {
  SettingsHeaderBlock,
  SettingsHeaderContent,
  SettingsHeaderText,
  SettingsHeaderTitle,
  SettingsHeaderInviteButton,
  SettingsHeaderInviteButtonIcon,
} from './styles';
import GeneralSettings from '../Icons/generalSettings';
import PlusIcon from 'components/Icons/plus';

export const HeaderBlock = (props) => {
  const { title, description, icon } = props;

  return (
    <SettingsHeaderBlock>
      {icon ? icon : <GeneralSettings circle />}
      <SettingsHeaderContent>
        <SettingsHeaderTitle>{title}</SettingsHeaderTitle>
        <SettingsHeaderText>{description}</SettingsHeaderText>
      </SettingsHeaderContent>
      <SettingsHeaderInviteButton>
        Invite
        <SettingsHeaderInviteButtonIcon>
          <PlusIcon fill="#FFFFFF" />
        </SettingsHeaderInviteButtonIcon>
      </SettingsHeaderInviteButton>
    </SettingsHeaderBlock>
  );
};
