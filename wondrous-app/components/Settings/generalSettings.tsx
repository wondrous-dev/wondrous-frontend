import React, { useState } from 'react';
import { useRouter } from 'next/router';

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
  Snackbar,
} from './styles';
import TwitterPurpleIcon from '../Icons/twitterPurple';
import LinkedInIcon from '../Icons/linkedIn';
import OpenSeaIcon from '../Icons/openSea';
import LinkBigIcon from '../Icons/link';
import { Discord } from '../Icons/discord';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ORG_BY_ID } from '../../graphql/queries';
import { UPDATE_ORG } from '../../graphql/mutations/org';

const SOCIALS_DATA = [
  {
    icon: <TwitterPurpleIcon />,
    link: 'https://twitter.com/',
    type: 'twitter',
  },
  {
    icon: <LinkedInIcon />,
    link: 'https://linkedin.com/',
    type: 'linkedin',
  },
  {
    icon: <OpenSeaIcon />,
    link: 'https://opensea.io/',
    type: 'opensea',
  },
];

const LINKS_DATA = [
  {
    icon: <LinkBigIcon />,
    label: 'Pitch Deck',
    link: '',
    type: 'pitchDeck',
  },
  {
    icon: <LinkBigIcon />,
    label: 'Our Manifesto',
    link: '',
    type: 'ourManifesto',
  },
];

const GeneralSettings = () => {
  const [logoImage, setLogoImage] = useState('');
  const [orgProfile, setOrgProfile] = useState(null);
  const [originalOrgProfile, setOriginalOrgProfile] = useState(null);
  const [bannerImage, setBannerImage] = useState('');
  const [orgLinks, setOrgLinks] = useState({});
  const [descriptionText, setDescriptionText] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });
  const router = useRouter();
  const { orgId } = router.query;

  function setOrganization(organization) {
    setOriginalOrgProfile(organization);
    const links = (organization.links || []).reduce((acc, link) => {
      acc[link.type] = {
        displayName: link.displayName,
        type: link.type,
        url: link.url,
      };

      return acc;
    }, {});

    setOrgLinks(links);
    setDescriptionText(organization.description.slice(0, 3));
    setOrgProfile(organization);
  }

  useQuery(GET_ORG_BY_ID, {
    onCompleted: ({ getOrgById }) => setOrganization(getOrgById),
    variables: { orgId },
  });

  const [updateOrg] = useMutation(UPDATE_ORG, {
    onCompleted: ({ updateOrg: org }) => {
      setToast({ ...toast, message: `DAO updated successfully.`, show: true });
    },
  });

  function handleDescriptionChange(e) {
    const { value } = e.target;

    if (value.length <= 100) {
      setDescriptionText(value);
      setOrgProfile({ ...orgProfile, description: value });
    }
  }

  function resetChanges() {
    setOrganization(originalOrgProfile);
  }

  function saveChanges() {
    const links = Object.values(orgLinks);

    updateOrg({
      variables: {
        orgId,
        input: {
          links,
          name: orgProfile.name,
          username: orgProfile.username,
          description: orgProfile.description,
          privacyLevel: orgProfile.privacyLevel,
          headerPicture: orgProfile.headerPicture,
          profilePicture: orgProfile.profilePicture,
          tags: orgProfile.tags,
        },
      },
    });
  }

  function handleLinkChange(event, item) {
    const links = { ...orgLinks };
    let url = event.currentTarget.value;
    if (item.link && !url.includes(item.link)) {
      return;
    }

    if (!url.includes('http')) {
      url = `https://${url}`;
    }

    links[item.type] = {
      url,
      displayName: url,
      type: item.type,
    };

    setOrgLinks(links);
  }

  if (!orgProfile) {
    return (
      <SettingsWrapper>
        <GeneralSettingsContainer>
          <HeaderBlock title="General settings" description="Update profile page settings." />
        </GeneralSettingsContainer>
      </SettingsWrapper>
    );
  }

  return (
    <SettingsWrapper>
      <GeneralSettingsContainer>
        <Snackbar
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
          message={toast.message}
        />

        <HeaderBlock title="General settings" description="Update profile page settings." />
        <GeneralSettingsInputsBlock>
          <GeneralSettingsDAONameBlock>
            <LabelBlock>DAO Name</LabelBlock>
            <GeneralSettingsDAONameInput
              value={orgProfile.name}
              onChange={(e) => setOrgProfile({ ...orgProfile, name: e.target.value })}
            />
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
            {SOCIALS_DATA.map((item) => {
              const value = orgLinks[item.type] ? orgLinks[item.type].url : item.link;

              return (
                <GeneralSettingsSocialsBlockRow key={item.type}>
                  <LinkSquareIcon icon={item.icon} />
                  <InputField value={value} onChange={(e) => handleLinkChange(e, item)} />
                </GeneralSettingsSocialsBlockRow>
              );
            })}
          </GeneralSettingsSocialsBlockWrapper>
        </GeneralSettingsSocialsBlock>
        <GeneralSettingsSocialsBlock>
          <LabelBlock>Links</LabelBlock>
          <GeneralSettingsSocialsBlockWrapper>
            {LINKS_DATA.map((item) => {
              const value = orgLinks[item.type] ? orgLinks[item.type].url : item.link;

              return (
                <GeneralSettingsSocialsBlockRow key={item.type}>
                  <LinkSquareIcon icon={item.icon} />
                  <GeneralSettingsSocialsBlockRowLabel>{item.label}</GeneralSettingsSocialsBlockRowLabel>
                  <InputField value={value} onChange={(e) => handleLinkChange(e, item)} />
                </GeneralSettingsSocialsBlockRow>
              );
            })}
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
          <GeneralSettingsResetButton onClick={resetChanges}>Reset changes</GeneralSettingsResetButton>
          <GeneralSettingsSaveChangesButton onClick={saveChanges} highlighted>
            Save changes
          </GeneralSettingsSaveChangesButton>
        </GeneralSettingsButtonsBlock>
      </GeneralSettingsContainer>
    </SettingsWrapper>
  );
};

export default GeneralSettings;
