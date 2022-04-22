import { useLazyQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { UPDATE_ORG } from '../../graphql/mutations/org';
import { UPDATE_POD } from '../../graphql/mutations/pod';
import { GET_ORG_BY_ID } from '../../graphql/queries/org';
import { GET_POD_BY_ID } from '../../graphql/queries/pod';
import { filteredColorOptions, PRIVACY_LEVEL } from '../../utils/constants';
import { getFilenameAndType, uploadMedia } from '../../utils/media';
import { TabsVisibility } from '../Common/TabsVisibility';
import { CreateFormAddDetailsInputLabel, CreateFormAddDetailsTab } from '../CreateEntity/styles';
import { DiscordIcon } from '../Icons/discord';
import LinkBigIcon from '../Icons/link';
import OpenSeaIcon from '../Icons/openSea';
import TwitterPurpleIcon from '../Icons/twitterPurple';
import ColorSettings from './ColorDropdown';
import { HeaderBlock } from './headerBlock';
import { ImageUpload } from './imageUpload';
import { InputField } from './inputField';
import { LinkSquareIcon } from './linkSquareIcon';
import { SettingsWrapper } from './settingsWrapper';
import {
  GeneralSettingsButtonsBlock,
  GeneralSettingsContainer,
  GeneralSettingsDAODescriptionBlock,
  GeneralSettingsDAODescriptionInput,
  GeneralSettingsDAODescriptionInputCounter,
  GeneralSettingsDAOHeaderImage,
  GeneralSettingsDAONameBlock,
  GeneralSettingsDAONameInput,
  GeneralSettingsDAOProfileImage,
  GeneralSettingsInputsBlock,
  GeneralSettingsResetButton,
  GeneralSettingsSaveChangesButton,
  GeneralSettingsSocialsBlock,
  GeneralSettingsSocialsBlockRow,
  GeneralSettingsSocialsBlockWrapper,
  LabelBlock,
  Snackbar,
} from './styles';

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
    type: 'discord',
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
    color,
    setColor,
    logoImage,
    typeText,
    descriptionText,
    handleDescriptionChange,
    links,
    handleLinkChange,
    resetChanges,
    saveChanges,
    isPrivate,
    setIsPrivate,
    discordWebhookLink,
    setDiscordWebhookLink,
    headerImage,
    handleImageChange,
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
  const isPod = typeText === 'Pod';
  const tabsVisibilityOptions = { [PRIVACY_LEVEL.public]: 'Public', [PRIVACY_LEVEL.private]: 'Pod Members Only' };
  const tabsVisibilitySelected = isPrivate
    ? tabsVisibilityOptions[PRIVACY_LEVEL.private]
    : tabsVisibilityOptions[PRIVACY_LEVEL.public];
  const tabsVisibilityHandleOnChange = (e) => setIsPrivate(e.target.getAttribute('value') === PRIVACY_LEVEL.private);
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
            <LabelBlock>{isPod ? 'Pod' : 'DAO'} description</LabelBlock>
            <GeneralSettingsDAODescriptionInput
              multiline
              rows={3}
              value={descriptionText}
              onChange={(e) => handleDescriptionChange(e)}
            />
            <GeneralSettingsDAODescriptionInputCounter>
              {descriptionText?.length} / {LIMIT} characters
            </GeneralSettingsDAODescriptionInputCounter>
          </GeneralSettingsDAODescriptionBlock>
        </GeneralSettingsInputsBlock>
        {newProfile?.profilePicture && !logoImage ? (
          <GeneralSettingsDAOProfileImage src={newProfile?.profilePicture} />
        ) : null}
        {!isPod && (
          <ImageUpload
            image={logoImage}
            imageWidth={52}
            imageHeight={52}
            imageName="Logo"
            updateFilesCb={(file) => handleImageChange(file, 'profile')}
          />
        )}
        {newProfile?.headerPicture && !headerImage && <GeneralSettingsDAOHeaderImage src={newProfile?.headerPicture} />}
        {!isPod && (
          <ImageUpload
            image={headerImage}
            imageWidth="1350"
            imageHeight="200"
            imageName="Header"
            updateFilesCb={(file) => handleImageChange(file, 'header')}
          />
        )}
        {isPod && (
          <GeneralSettingsInputsBlock>
            <GeneralSettingsDAONameBlock>
              <ColorSettings
                title="Pod color"
                value={color}
                setValue={setColor}
                labelText="Choose a color"
                options={filteredColorOptions}
              />
            </GeneralSettingsDAONameBlock>
          </GeneralSettingsInputsBlock>
        )}
        <GeneralSettingsSocialsBlock>
          <LabelBlock>Socials</LabelBlock>
          <GeneralSettingsSocialsBlockWrapper>
            {SOCIALS_DATA.map((item) => {
              const value = links[item.type] ? links[item.type].url : '';

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
            {linkTypelinks?.length > 0 ? (
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

        {isPod && (
          <div
            style={{
              marginTop: '32px',
            }}
          >
            <CreateFormAddDetailsTab>
              <CreateFormAddDetailsInputLabel>Visibility</CreateFormAddDetailsInputLabel>
              <TabsVisibility
                options={tabsVisibilityOptions}
                selected={tabsVisibilitySelected}
                onChange={tabsVisibilityHandleOnChange}
              />
            </CreateFormAddDetailsTab>
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
  // Case when value doesn't contain domain name
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
  const [color, setColor] = useState(null);
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
    setColor(pod?.color);
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
          color: color,
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
      color={color}
      setColor={setColor}
    />
  );
};

const GeneralSettings = () => {
  const [logoImage, setLogoImage] = useState('');
  const [orgProfile, setOrgProfile] = useState(null);
  const [headerImage, setHeaderImage] = useState('');
  const [orgLinks, setOrgLinks] = useState([]);
  const [descriptionText, setDescriptionText] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });
  const router = useRouter();
  const { orgId } = router.query;

  function setOrganization(organization) {
    setLogoImage('');
    const links = reduceLinks(organization.links);

    setOrgLinks(links);
    setDescriptionText(organization.description);

    setOrgProfile(organization);
  }

  const [getOrgById, { data: getOrgByIdData }] = useLazyQuery(GET_ORG_BY_ID, {
    onCompleted: ({ getOrgById }) => setOrganization(getOrgById),
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (orgId) {
      getOrgById({ variables: { orgId } });
    }
  }, [orgId]);

  const [updateOrg] = useMutation(UPDATE_ORG, {
    onCompleted: ({ updateOrg: org }) => {
      setOrganization(org);
      setToast({ ...toast, message: `DAO updated successfully.`, show: true });
    },
  });

  function handleImageFile(file) {
    if (!file) return { filename: null, fileType: null, file: null };
    const fileName = file?.name;
    // get image preview
    const { fileType, filename } = getFilenameAndType(fileName);
    const imageFile = `tmp/${orgId}/` + filename;
    return { filename: imageFile, fileType, file };
  }

  async function handleImageChange(file, imageType) {
    const type = {
      header: {
        setState: (file) => setHeaderImage(file),
        orgProfileKey: 'headerPicture',
      },
      profile: {
        setState: (file) => setLogoImage(file),
        orgProfileKey: 'profilePicture',
      },
    };
    const { setState, orgProfileKey } = type[imageType];
    setState(file);
    const imageFile = handleImageFile(file);
    setOrgProfile({
      ...orgProfile,
      [orgProfileKey]: imageFile.filename ?? getOrgByIdData?.getOrgById[orgProfileKey],
    });
    imageFile.filename && (await uploadMedia(imageFile));
  }

  function handleDescriptionChange(e) {
    const { value } = e.target;

    if (value.length <= LIMIT) {
      setDescriptionText(value);
      setOrgProfile({ ...orgProfile, description: value });
    }
  }

  function resetChanges() {
    setOrganization(getOrgByIdData?.getOrgById);
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
      logoImage={logoImage}
      newProfile={orgProfile}
      resetChanges={resetChanges}
      saveChanges={saveChanges}
      typeText="DAO"
      setProfile={setOrgProfile}
      headerImage={headerImage}
      handleImageChange={handleImageChange}
    />
  );
};

export default GeneralSettings;
