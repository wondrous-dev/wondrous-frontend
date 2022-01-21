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

const GeneralSettings = () => {
  const [logoImage, setLogoImage] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [descriptionText, setDescriptionText] = useState('');

  const handleDescriptionChange = (e) => {
    const { value } = e.target;

    if (value.length <= 100) {
      setDescriptionText(value);
    }
  };

  return (
    <SettingsWrapper>
      <GeneralSettingsContainer>
        <HeaderBlock title="General settings" description="Update profile page settings." />
        <GeneralSettingsInputsBlock>
          <GeneralSettingsDAONameBlock>
            <LabelBlock>DAO Name</LabelBlock>
            <GeneralSettingsDAONameInput />
          </GeneralSettingsDAONameBlock>
          <GeneralSettingsDAODescriptionBlock>
            <LabelBlock>DAO description</LabelBlock>
            <GeneralSettingsDAODescriptionInput
              multiline
              rows={3}
              value={descriptionText}
              onChange={(e) => handleDescriptionChange(e)}
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
        <GeneralSettingsSocialsBlock>
          <LabelBlock>Socials</LabelBlock>
          <GeneralSettingsSocialsBlockWrapper>
            {SOCIALS_DATA.map((item) => (
              <GeneralSettingsSocialsBlockRow key={item.link}>
                <LinkSquareIcon icon={item.icon} />
                <InputField value={item.link} />
              </GeneralSettingsSocialsBlockRow>
            ))}
          </GeneralSettingsSocialsBlockWrapper>
        </GeneralSettingsSocialsBlock>
        <GeneralSettingsSocialsBlock>
          <LabelBlock>Links</LabelBlock>
          <GeneralSettingsSocialsBlockWrapper>
            {LINKS_DATA.map((item) => (
              <GeneralSettingsSocialsBlockRow key={item.link}>
                <LinkSquareIcon icon={item.icon} />
                <GeneralSettingsSocialsBlockRowLabel>{item.label}</GeneralSettingsSocialsBlockRowLabel>
                <InputField value={item.link} />
              </GeneralSettingsSocialsBlockRow>
            ))}
          </GeneralSettingsSocialsBlockWrapper>
        </GeneralSettingsSocialsBlock>

        {/* <GeneralSettingsIntegrationsBlock>
					<LabelBlock>Integrations</LabelBlock>
					<GeneralSettingsIntegrationsBlockButton highlighted>
						<GeneralSettingsIntegrationsBlockButtonIcon />
						Connect discord
					</GeneralSettingsIntegrationsBlockButton>
				</GeneralSettingsIntegrationsBlock> */}

        <GeneralSettingsButtonsBlock>
          <GeneralSettingsResetButton>Reset changes</GeneralSettingsResetButton>
          <GeneralSettingsSaveChangesButton highlighted>Save changes</GeneralSettingsSaveChangesButton>
        </GeneralSettingsButtonsBlock>
      </GeneralSettingsContainer>
    </SettingsWrapper>
  );
};

export default GeneralSettings;
