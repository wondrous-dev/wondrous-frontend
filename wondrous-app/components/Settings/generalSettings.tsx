import React, { useCallback, useEffect, useState } from 'react';
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
import { DiscordIcon } from '../Icons/discord';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_ORG_BY_ID } from '../../graphql/queries/org';
import { UPDATE_ORG } from '../../graphql/mutations/org';
import { getFilenameAndType, uploadMedia } from '../../utils/media';
import { SafeImage } from '../Common/Image';
import { GET_POD_BY_ID } from '../../graphql/queries/pod';
import { UPDATE_POD } from '../../graphql/mutations/pod';
import { CreateFormAddDetailsInputLabel, CreateFormAddDetailsSwitch } from '../CreateEntity/styles';
import { AndroidSwitch } from '../CreateEntity/createEntityModal';
import { PRIVACY_LEVEL } from '../../utils/constants';

const LIMIT = 200;

const SOCIALS_DATA = [
  {
    icon: <TwitterPurpleIcon />,
    link: 'https://twitter.com/',
    type: 'twitter',
  },
  {
    icon: <DiscordIcon />,
    link: 'https://discord.gg/',
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
    link: 'link',
    type: 'pitchDeck',
  },
];

const GeneralSettingsComponent = (props) => {
  const {
    toast,
    setToast,
    setProfile,
    newProfile,
    logoImage,
    typeText,
    descriptionText,
    handleDescriptionChange,
    links,
    handleLogoChange,
    handleLinkChange,
    resetChanges,
    saveChanges,
    isPrivate,
    setIsPrivate,
  } = props;

  const [newLink, setNewLink] = useState({
    type: 'link',
    url: '',
    displayName: '',
  });
  const linkTypelinks = [];
  Object.keys(links).map((key) => {
    const value = links[key];
    if (value.type === 'link') {
      linkTypelinks.push(value);
    }
  });

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
            <LabelBlock>{typeText} Name</LabelBlock>
            <GeneralSettingsDAONameInput
              value={newProfile?.name}
              onChange={(e) => setProfile({ ...newProfile, name: e.target.value })}
            />
          </GeneralSettingsDAONameBlock>
          <GeneralSettingsDAODescriptionBlock>
            <LabelBlock>Pod description</LabelBlock>
            <GeneralSettingsDAODescriptionInput
              multiline
              rows={3}
              value={descriptionText}
              onChange={(e) => handleDescriptionChange(e)}
            />
            <GeneralSettingsDAODescriptionInputCounter>
              {descriptionText.length} / {LIMIT} characters
            </GeneralSettingsDAODescriptionInputCounter>
          </GeneralSettingsDAODescriptionBlock>
        </GeneralSettingsInputsBlock>
        {newProfile?.profilePicture && !logoImage ? (
          <SafeImage
            src={newProfile?.profilePicture}
            style={{
              width: '52px',
              height: '52px',
              marginTop: '30px',
            }}
          />
        ) : null}
        <ImageUpload
          image={logoImage}
          imageWidth={52}
          imageHeight={52}
          imageName="Logo"
          updateFilesCb={handleLogoChange}
        />
        {/* <ImageUpload
      image={bannerImage}
      imageWidth={1350}
      imageHeight={259}
      imageName="Banner"
      updateFilesCb={setBannerImage}
    /> */}
        <GeneralSettingsSocialsBlock>
          <LabelBlock>Socials</LabelBlock>
          <GeneralSettingsSocialsBlockWrapper>
            {SOCIALS_DATA.map((item) => {
              const value = links[item.type] ? links[item.type].url : item.link;

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
            {linkTypelinks.length > 0 ? (
              linkTypelinks.map((link) => (
                <GeneralSettingsSocialsBlockRow key={link.type}>
                  <LinkSquareIcon icon={<LinkBigIcon />} />
                  <InputField value={link.url} onChange={(e) => handleLinkChange(e, link)} />
                </GeneralSettingsSocialsBlockRow>
              ))
            ) : (
              <>
                <GeneralSettingsSocialsBlockRow key={newLink.type}>
                  <LinkSquareIcon icon={<LinkBigIcon />} />
                  <InputField value={newLink.url} onChange={(e) => handleLinkChange(e, newLink)} />
                </GeneralSettingsSocialsBlockRow>
              </>
            )}
          </GeneralSettingsSocialsBlockWrapper>
        </GeneralSettingsSocialsBlock>

        {/* <GeneralSettingsIntegrationsBlock>
      <LabelBlock>Integrations</LabelBlock>
      <GeneralSettingsIntegrationsBlockButton highlighted>
        <GeneralSettingsIntegrationsBlockButtonIcon />
        Connect discord
      </GeneralSettingsIntegrationsBlockButton>
    </GeneralSettingsIntegrationsBlock> */}

        {typeText === 'Pod' && (
          <div
            style={{
              marginTop: '32px',
            }}
          >
            <CreateFormAddDetailsSwitch>
              <CreateFormAddDetailsInputLabel>Private Pod</CreateFormAddDetailsInputLabel>
              <AndroidSwitch
                checked={isPrivate}
                onChange={(e) => {
                  setIsPrivate(e.target.checked);
                }}
              />
            </CreateFormAddDetailsSwitch>
          </div>
        )}

        <GeneralSettingsButtonsBlock>
          <GeneralSettingsResetButton onClick={resetChanges}>Reset changes</GeneralSettingsResetButton>
          <GeneralSettingsSaveChangesButton
            buttonInnerStyle={{
              fontFamily: 'Space Grotesk',
              fontWeight: 'bold',
            }}
            onClick={saveChanges}
            highlighted
          >
            Save changes
          </GeneralSettingsSaveChangesButton>
        </GeneralSettingsButtonsBlock>
      </GeneralSettingsContainer>
    </SettingsWrapper>
  );
};

const reduceLinks = (existingLinks) => {
  const links = (existingLinks || []).reduce((acc, link) => {
    acc[link.type] = {
      displayName: link.displayName,
      type: link.type,
      url: link.url,
    };

    return acc;
  }, {});
  return links;
};

const handleLinkChange = (event, item, existingLinks, setLinks) => {
  const links = { ...existingLinks };
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

  setLinks(links);
};

export const PodGeneralSettings = () => {
  const router = useRouter();
  const { podId } = router.query;
  const [podProfile, setPodProfile] = useState(null);
  const [isPrivate, setIsPrivate] = useState(null);
  const [originalPodProfile, setOriginalPodProfile] = useState(null);
  const [logoImage, setLogoImage] = useState('');
  const [getPod] = useLazyQuery(GET_POD_BY_ID, {
    onCompleted: ({ getPodById }) => setPod(getPodById),
    fetchPolicy: 'cache-and-network',
  });
  const [podLinks, setPodLinks] = useState([]);
  const [descriptionText, setDescriptionText] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });

  function setPod(pod) {
    setPodProfile(pod);
    setLogoImage('');
    const links = reduceLinks(pod.links);

    setPodLinks(links);
    setDescriptionText(pod.description);
    setIsPrivate(pod?.privacyLevel === PRIVACY_LEVEL.private);
    setOriginalPodProfile(pod);
  }

  useEffect(() => {
    if (podId) {
      getPod({ variables: { podId } });
    }
  }, [podId]);

  const [updatePod] = useMutation(UPDATE_POD, {
    onCompleted: ({ updatePod: pod }) => {
      setPodProfile(pod);
      setToast({ ...toast, message: `Pod updated successfully.`, show: true });
    },
  });

  async function handleLogoChange(file) {
    setLogoImage(file);

    if (file) {
      const fileName = file?.name;
      // get image preview
      const { fileType, filename } = getFilenameAndType(fileName);
      const imagePrefix = `tmp/${podId}/`;
      const profilePicture = imagePrefix + filename;
      await uploadMedia({ filename: profilePicture, fileType, file });

      setPodProfile({ ...podProfile, profilePicture });
    }
  }

  function handleDescriptionChange(e) {
    const { value } = e.target;

    if (value.length <= LIMIT) {
      setDescriptionText(value);
      setPodProfile({ ...podProfile, description: value });
    }
  }

  function resetChanges() {
    setPodProfile(originalPodProfile);
  }

  function saveChanges() {
    const links = Object.values(podLinks);

    updatePod({
      variables: {
        podId,
        input: {
          links,
          name: podProfile.name,
          description: podProfile.description,
          privacyLevel: isPrivate ? PRIVACY_LEVEL.private : PRIVACY_LEVEL.public,
          headerPicture: podProfile.headerPicture,
          profilePicture: podProfile.profilePicture,
        },
      },
    });
  }

  return (
    <GeneralSettingsComponent
      toast={toast}
      setToast={setToast}
      descriptionText={descriptionText}
      handleDescriptionChange={handleDescriptionChange}
      handleLinkChange={(event, item) => handleLinkChange(event, item, { ...podLinks }, setPodLinks)}
      links={podLinks}
      handleLogoChange={handleLogoChange}
      logoImage={logoImage}
      newProfile={podProfile}
      resetChanges={resetChanges}
      saveChanges={saveChanges}
      typeText="Pod"
      setProfile={setPodProfile}
      isPrivate={isPrivate}
      setIsPrivate={setIsPrivate}
    />
  );
};

const GeneralSettings = () => {
  const [logoImage, setLogoImage] = useState('');
  const [orgProfile, setOrgProfile] = useState(null);
  const [originalOrgProfile, setOriginalOrgProfile] = useState(null);
  const [bannerImage, setBannerImage] = useState('');
  const [orgLinks, setOrgLinks] = useState([]);
  const [descriptionText, setDescriptionText] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });
  const router = useRouter();
  const { orgId } = router.query;

  function setOrganization(organization) {
    setOriginalOrgProfile(organization);
    setLogoImage('');
    const links = reduceLinks(organization.links);

    setOrgLinks(links);
    setDescriptionText(organization.description);

    setOrgProfile(organization);
  }

  const [getOrganization] = useLazyQuery(GET_ORG_BY_ID, {
    onCompleted: ({ getOrgById }) => setOrganization(getOrgById),
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (orgId) {
      getOrganization({ variables: { orgId } });
    }
  }, [orgId]);

  const [updateOrg] = useMutation(UPDATE_ORG, {
    onCompleted: ({ updateOrg: org }) => {
      setOrganization(org);
      setToast({ ...toast, message: `DAO updated successfully.`, show: true });
    },
  });

  async function handleLogoChange(file) {
    setLogoImage(file);

    if (file) {
      const fileName = file?.name;
      // get image preview
      const { fileType, filename } = getFilenameAndType(fileName);
      const imagePrefix = `tmp/${orgId}/`;
      const profilePicture = imagePrefix + filename;
      await uploadMedia({ filename: profilePicture, fileType, file });

      setOrgProfile({ ...orgProfile, profilePicture });
    }
  }

  function handleDescriptionChange(e) {
    const { value } = e.target;

    if (value.length <= LIMIT) {
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
          description: orgProfile.description,
          privacyLevel: orgProfile.privacyLevel,
          headerPicture: orgProfile.headerPicture,
          profilePicture: orgProfile.profilePicture,
        },
      },
    });
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
    <GeneralSettingsComponent
      toast={toast}
      setToast={setToast}
      descriptionText={descriptionText}
      handleDescriptionChange={handleDescriptionChange}
      handleLinkChange={(event, item) => handleLinkChange(event, item, { ...orgLinks }, setOrgLinks)}
      links={orgLinks}
      handleLogoChange={handleLogoChange}
      logoImage={logoImage}
      newProfile={orgProfile}
      resetChanges={resetChanges}
      saveChanges={saveChanges}
      typeText="DAO"
      setProfile={setOrgProfile}
    />
  );
};

export default GeneralSettings;
