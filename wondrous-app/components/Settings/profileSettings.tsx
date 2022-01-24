import React, { useState } from 'react';
import { SettingsWrapper } from './settingsWrapper';
import { HeaderBlock } from './headerBlock';
import { ImageUpload } from './imageUpload';
import { LinkSquareIcon } from './linkSquareIcon';
import { InputField } from './inputField';
import {
  GeneralSettingsButtonsBlock,
  GeneralSettingsContainer,
  GeneralSettingsDAODescriptionBlock,
  GeneralSettingsDAODescriptionInput,
  GeneralSettingsDAODescriptionInputCounter,
  GeneralSettingsDAONameBlock,
  GeneralSettingsDAONameInput,
  GeneralSettingsInputsBlock,
  GeneralSettingsIntegrationsBlock,
  GeneralSettingsIntegrationsBlockButton,
  GeneralSettingsIntegrationsBlockButtonIcon,
  GeneralSettingsResetButton,
  GeneralSettingsSaveChangesButton,
  GeneralSettingsSocialsBlock,
  GeneralSettingsSocialsBlockRow,
  GeneralSettingsSocialsBlockRowLabel,
  GeneralSettingsSocialsBlockWrapper,
  LabelBlock,
} from './styles';
import TwitterPurpleIcon from '../Icons/twitterPurple';
import LinkedInIcon from '../Icons/linkedIn';
import OpenSeaIcon from '../Icons/openSea';
import LinkBigIcon from '../Icons/link';
import { Discord } from '../Icons/discord';
import { useMe } from '../Auth/withAuth';

const SOCIALS_DATA = [
  {
    icon: <TwitterPurpleIcon />,
    link: 'https://twitter.com/wonderverse_xyz',
  },
  {
    icon: <LinkedInIcon />,
    link: 'https://twitter.com/wonderverse_xyz',
  },
  {
    icon: <OpenSeaIcon />,
    link: 'https://opensea.io/wonderverse',
  },
];

const LINKS_DATA = [
  {
    icon: <LinkBigIcon />,
    label: 'Pitch Deck',
    link: 'https://opensea.io/wonderverse',
  },
  {
    icon: <LinkBigIcon />,
    label: 'Our Manifesto',
    link: 'https://opensea.io/wonderverse',
  },
];

const ProfileSettings = () => {

  const user = useMe()

  const handleUsernameChange = (e) => {
    const { value } = e.target;

    if(value) {
        console.log('Username change.')
    }
  }

  return (
    <SettingsWrapper>
      <GeneralSettingsContainer>
        <HeaderBlock title="Profile page overview" description="Update profile page settings." />
        <GeneralSettingsInputsBlock>
          <GeneralSettingsDAONameBlock>
            <LabelBlock>Display name</LabelBlock>
            <GeneralSettingsDAONameInput 
                value={user?.displayName}
            />
          </GeneralSettingsDAONameBlock>
          <GeneralSettingsDAODescriptionBlock>
            <LabelBlock>Username</LabelBlock>
            <GeneralSettingsDAONameInput 
                value={user?.username}
                onchange={handleUsernameChange}
            />
            <GeneralSettingsDAODescriptionInputCounter>
              {descriptionText.length} / 100 characters
            </GeneralSettingsDAODescriptionInputCounter>
          </GeneralSettingsDAODescriptionBlock>
        </GeneralSettingsInputsBlock>
        <ImageUpload image={logoImage} imageWidth={52} imageHeight={52} imageName="Logo" updateFilesCb={setLogoImage} />
        <ImageUpload
          image={bannerImage}
          imageWidth={1350}
          imageHeight={259}
          imageName="Banner"
          updateFilesCb={setBannerImage}
        />
       
        <GeneralSettingsButtonsBlock>
          <GeneralSettingsResetButton>Reset changes</GeneralSettingsResetButton>
          <GeneralSettingsSaveChangesButton highlighted>Save changes</GeneralSettingsSaveChangesButton>
        </GeneralSettingsButtonsBlock>
      </GeneralSettingsContainer>
    </SettingsWrapper>
  );
};

export default ProfileSettings;
