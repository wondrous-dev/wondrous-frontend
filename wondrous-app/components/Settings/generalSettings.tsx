import { useLazyQuery, useMutation } from '@apollo/client';
import { Box } from '@mui/system';
import { SafeImage } from 'components/Common/Image';
import SettingsWrapper from 'components/Common/SidebarSettings';
import HeaderBlock from 'components/Settings/headerBlock';
import { DeleteButton } from 'components/Settings/Roles/styles';
import { AVATAR_EDITOR_TYPES } from 'constants/avatarEditor';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import apollo from 'services/apollo';
import { ImageKeyEnums, ImageTypes } from 'types/common';
import { filteredColorOptions, PRIVACY_LEVEL } from 'utils/constants';
import { usePageDataContext } from 'utils/hooks';
import ImageUpload from 'components/Settings/imageUpload';
import useAlerts from 'hooks/useAlerts';
import { UPDATE_ORG } from '../../graphql/mutations/org';
import { ARCHIVE_POD, UNARCHIVE_POD, UPDATE_POD } from '../../graphql/mutations/pod';
import { GET_ORG_BY_ID } from '../../graphql/queries/org';
import { GET_POD_BY_ID } from '../../graphql/queries/pod';
import { getFilenameAndType, uploadMedia } from '../../utils/media';
import { TabsVisibility } from '../Common/TabsVisibility';
import { CreateFormAddDetailsInputLabel, CreateFormAddDetailsTab } from '../CreateEntity/styles';
import { DiscordIcon } from '../Icons/discord';
import LinkBigIcon from '../Icons/link';
import OpenSeaIcon from '../Icons/openSea';
import TwitterPurpleIcon from '../Icons/twitterPurple';
import ColorSettings from './ColorDropdown';
import { InputField } from './inputField';
import { LinkSquareIcon } from './linkSquareIcon';
import {
  CreateFormAddDetailsTabWrapper,
  GeneralSettingsButtonsBlock,
  GeneralSettingsContainer,
  GeneralSettingsDAODescriptionBlock,
  GeneralSettingsDAODescriptionInput,
  GeneralSettingsDAODescriptionInputCounter,
  GeneralSettingsDAONameBlock,
  GeneralSettingsDAONameInput,
  GeneralSettingsInputsBlock,
  GeneralSettingsResetButton,
  GeneralSettingsSaveChangesButton,
  GeneralSettingsSocialsBlock,
  GeneralSettingsSocialsBlockRow,
  GeneralSettingsSocialsBlockWrapper,
  LabelBlock,
  SettingsHeaderText,
  Snackbar,
} from './styles';

interface ToastProps {
  show: boolean;
  message: string;
}

interface GeneralSettingsProps {
  toast: ToastProps;
  descriptionText: string;
  orgProfile?: any;
  links: any[];
  headerImage: string;
  logoImage: string;
  newProfile: any;
  discordWebhookLink?: string;
  isPrivate: boolean;
  color?: string;
  isArchivedPod?: boolean;
  typeText: 'Pod' | 'Organization';
  resetChanges: () => void;
  saveChanges: () => void;
  setToast: React.Dispatch<React.SetStateAction<ToastProps>>;
  handleDescriptionChange(e: any): void;
  handleLinkChange: (event: any, item: any) => void;
  handleLogoChange?: (file: any) => Promise<void>;
  handleImageChange: (file: any, imageType: any) => Promise<void>;
  setProfile: React.Dispatch<React.SetStateAction<any>>;
  setIsPrivate: React.Dispatch<React.SetStateAction<boolean>>;
  setColor?: React.Dispatch<React.SetStateAction<string>>;
  handleArchivePodClick?: () => Promise<void>;
  handleUnarchivePodClick?: () => Promise<void>;
  onDeleteImage: (imageType: ImageKeyEnums) => void;
  setDiscordWebhookLink?: React.Dispatch<React.SetStateAction<string>>;
}

const LIMIT = 200;

const SOCIALS_DATA = [
  {
    icon: <TwitterPurpleIcon />,
    title: 'Twitter',
    link: 'https://twitter.com/',
    type: 'twitter',
  },
  {
    icon: <DiscordIcon fill="#ccbbff" />,
    title: 'Discord',
    link: 'https://discord.gg/',
    type: 'discord',
  },
  {
    icon: <OpenSeaIcon />,
    title: 'OpenSea',
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

function GeneralSettingsComponent(props: GeneralSettingsProps) {
  const {
    toast,
    setToast,
    setProfile,
    newProfile,
    color,
    setColor,
    orgProfile,
    typeText,
    descriptionText,
    handleDescriptionChange,
    links,
    handleLinkChange,
    resetChanges,
    saveChanges,
    isPrivate,
    setIsPrivate,
    handleImageChange,
    isArchivedPod,
    handleArchivePodClick,
    handleUnarchivePodClick,
    onDeleteImage,
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
  const tabsVisibilityOptions = {
    [PRIVACY_LEVEL.public]: {
      title: 'Public',
      tooltip: `Public means anyone can see this ${typeText?.toLowerCase()}`,
    },
    [PRIVACY_LEVEL.private]: {
      title: isPod ? 'Pod Members Only' : 'Org members Only',
      tooltip: `Private means only those with the proper permissions can see this ${typeText?.toLowerCase()}`,
    },
  };

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

        <HeaderBlock
          title="General settings"
          description="Update profile page settings."
          icon={orgProfile?.profilePicture}
        />
        <GeneralSettingsInputsBlock>
          <GeneralSettingsDAONameBlock>
            <LabelBlock>{typeText} Name</LabelBlock>
            <GeneralSettingsDAONameInput
              value={newProfile?.name}
              onChange={(e) => setProfile({ ...newProfile, name: e.target.value })}
            />
          </GeneralSettingsDAONameBlock>
          <GeneralSettingsDAODescriptionBlock>
            <LabelBlock>{isPod ? 'Pod' : 'Org'} description</LabelBlock>
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

        {!orgProfile?.shared && !isPod ? (
          <ImageUpload
            image={newProfile?.profilePicture}
            imageType={AVATAR_EDITOR_TYPES.ICON_IMAGE}
            title="Logo"
            updateFilesCb={(iconImg) => handleImageChange(iconImg, 'profile')}
            avatarEditorTitle="Upload a profile image"
            onDeleteImage={onDeleteImage}
          />
        ) : null}

        <ImageUpload
          image={newProfile?.headerPicture}
          title="Header"
          imageType={AVATAR_EDITOR_TYPES.HEADER_IMAGE}
          updateFilesCb={(headerImg) => handleImageChange(headerImg, 'header')}
          avatarEditorTitle="Upload a header image"
          onDeleteImage={onDeleteImage}
        />

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
                  <LinkSquareIcon icon={item.icon} title={item.title} />
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
                  <LinkSquareIcon title={link.title} icon={<LinkBigIcon />} />
                  <InputField value={link.url} onChange={(e) => handleLinkChange(e, link)} />
                </GeneralSettingsSocialsBlockRow>
              ))
            ) : (
              <GeneralSettingsSocialsBlockRow key={newLink.type}>
                <LinkSquareIcon title="Link" icon={<LinkBigIcon />} />
                <InputField value={newLink.url} onChange={(e) => handleLinkChange(e, newLink)} />
              </GeneralSettingsSocialsBlockRow>
            )}
          </GeneralSettingsSocialsBlockWrapper>
        </GeneralSettingsSocialsBlock>

        <CreateFormAddDetailsTabWrapper>
          <CreateFormAddDetailsTab>
            <CreateFormAddDetailsInputLabel>Visibility</CreateFormAddDetailsInputLabel>
            <TabsVisibility
              options={tabsVisibilityOptions}
              selected={tabsVisibilitySelected}
              onChange={tabsVisibilityHandleOnChange}
            />
          </CreateFormAddDetailsTab>
        </CreateFormAddDetailsTabWrapper>

        <GeneralSettingsButtonsBlock>
          <GeneralSettingsResetButton onClick={resetChanges}>Cancel changes</GeneralSettingsResetButton>
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
        {isArchivedPod && isPod && (
          <>
            <DeleteButton
              style={{
                marginTop: '32px',
              }}
              onClick={handleUnarchivePodClick}
            >
              Unarchive Pod
            </DeleteButton>
            <SettingsHeaderText
              style={{
                marginTop: '10px',
              }}
            >
              Unarchiving pod reenables you to create task under this pod
            </SettingsHeaderText>
          </>
        )}
        {!isArchivedPod && isPod && (
          <>
            <DeleteButton
              style={{
                marginTop: '32px',
              }}
              onClick={handleArchivePodClick}
            >
              Archive Pod
            </DeleteButton>
            <SettingsHeaderText
              style={{
                marginTop: '10px',
              }}
            >
              You can still access tasks from archived pods, but no new tasks can be created{' '}
            </SettingsHeaderText>
          </>
        )}
      </GeneralSettingsContainer>
    </SettingsWrapper>
  );
}

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
  const url = event.currentTarget.value;
  // Case when value doesn't contain domain name
  links[item.type] = {
    url,
    displayName: url,
    type: item.type,
  };

  setLinks(links);
};

export function PodGeneralSettings() {
  const router = useRouter();
  const { podId } = router.query;
  const { setSnackbarAlertOpen, setSnackbarAlertMessage } = useAlerts();
  const [podProfile, setPodProfile] = useState(null);
  const [isPrivate, setIsPrivate] = useState(null);
  const [isArchivedPod, setIsArchivedPod] = useState(false);
  const [originalPodProfile, setOriginalPodProfile] = useState(null);
  const [logoImage, setLogoImage] = useState('');
  const [color, setColor] = useState(null);
  const { setPageData } = usePageDataContext();
  const [getPod, { data: getPodByIdData }] = useLazyQuery(GET_POD_BY_ID, {
    onCompleted: ({ getPodById }) => {
      setPod(getPodById);
      setPageData({ pod: getPodById });
    },
    fetchPolicy: 'cache-and-network',
  });
  const [getOrg, { data: getOrgByIdData }] = useLazyQuery(GET_ORG_BY_ID, {
    fetchPolicy: 'cache-and-network',
  });
  const [headerImage, setHeaderImage] = useState('');
  const [podLinks, setPodLinks] = useState([]);
  const [descriptionText, setDescriptionText] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });

  function setPod(pod) {
    setPodProfile(pod);
    setLogoImage('');
    setHeaderImage('');
    const links = reduceLinks(pod.links);
    setColor(pod?.color);
    setPodLinks(links);
    setDescriptionText(pod.description);
    setIsPrivate(pod?.privacyLevel === PRIVACY_LEVEL.private);
    setOriginalPodProfile(pod);
    setIsArchivedPod(!!pod?.archivedAt);
  }

  useEffect(() => {
    if (podId) {
      getPod({ variables: { podId } });
    }

    if (podProfile?.orgId) {
      getOrg({
        variables: {
          orgId: podProfile?.orgId,
        },
      });
    }
  }, [podId, podProfile?.orgId]);

  const [updatePod] = useMutation(UPDATE_POD, {
    onCompleted: ({ updatePod: pod }) => {
      setPodProfile(pod);
      setLogoImage(pod?.profilePicture || '');
      setHeaderImage(pod?.headerPicture || '');
      setToast((prevToast) => ({
        ...prevToast,
        message: prevToast.message || 'Pod updated successfully.',
        show: true,
      }));
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

  function handleImageFile(file) {
    if (!file) return { filename: null, fileType: null, file: null };
    const fileName = file?.name;
    // get image preview
    const { fileType, filename } = getFilenameAndType(fileName);
    const imageFile = `tmp/${podId}/${filename}`;
    return { filename: imageFile, fileType, file };
  }
  async function handleImageChange(file, imageType) {
    const type = {
      header: {
        setState: (file) => setHeaderImage(file),
        podProfileKey: ImageKeyEnums.headerPicture,
      },
      profile: {
        setState: (file) => setLogoImage(file),
        podProfileKey: ImageKeyEnums.profilePicture,
      },
    };
    const { setState, podProfileKey } = type[imageType];
    setState(file);
    const imageFile = handleImageFile(file);
    setPodProfile({
      ...podProfile,
      [podProfileKey]: file === '' ? getPodByIdData.getPodById[podProfileKey] : imageFile.filename ?? null,
    });
    if (imageFile.filename) {
      await uploadMedia(imageFile);

      let message = '';
      if (imageType === ImageTypes.header) {
        message = 'Header cover profile updated successfully';
      }
      if (imageType === ImageTypes.profile) {
        message = 'Logo profile updated successfully';
      }
      setToast((prevToast) => ({ ...prevToast, message }));

      updatePod({
        variables: {
          podId,
          input: {
            headerPicture: imageType === ImageTypes.header ? imageFile.filename : podProfile.headerPicture,
            profilePicture: imageType === ImageTypes.profile ? imageFile.filename : podProfile.profilePicture,
          },
        },
      });
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

    setToast((prevToast) => ({ ...prevToast, message: 'Pod updated successfully.' }));

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
          color,
        },
      },
    });
  }

  function deleteImage(imageType: ImageKeyEnums) {
    let message = '';
    if (imageType === ImageKeyEnums.headerPicture) {
      message = 'Header cover profile deleted successfully';
    }
    if (imageType === ImageKeyEnums.profilePicture) {
      message = 'Logo profile deleted successfully';
    }
    setToast((prevToast) => ({ ...prevToast, message }));

    updatePod({
      variables: {
        podId,
        input: {
          headerPicture: imageType === ImageKeyEnums.headerPicture ? null : podProfile.headerPicture,
          profilePicture: imageType === ImageKeyEnums.profilePicture ? null : podProfile.profilePicture,
        },
      },
    });
  }

  const handleArchivePodClick = async () => {
    const confirmed = confirm('Are you sure you want to archive this pod?');
    if (!confirmed) {
      return;
    }
    await apollo.mutate({
      mutation: ARCHIVE_POD,
      variables: {
        podId,
      },
      refetchQueries: [GET_POD_BY_ID],
    });
    setSnackbarAlertMessage('Pod archived successfully');
    setSnackbarAlertOpen(true);
  };
  const handleUnarchivePodClick = async () => {
    const confirmed = confirm('Are you sure you want to unarchive this pod?');
    if (!confirmed) {
      return;
    }
    await apollo.mutate({
      mutation: UNARCHIVE_POD,
      variables: {
        podId,
      },
      refetchQueries: [GET_POD_BY_ID],
    });
    setSnackbarAlertMessage('Pod unarchived successfully');
    setSnackbarAlertOpen(true);
  };
  return (
    <GeneralSettingsComponent
      toast={toast}
      setToast={setToast}
      descriptionText={descriptionText}
      handleDescriptionChange={handleDescriptionChange}
      handleLinkChange={(event, item) => handleLinkChange(event, item, { ...podLinks }, setPodLinks)}
      links={podLinks}
      handleLogoChange={handleLogoChange}
      headerImage={headerImage}
      handleImageChange={handleImageChange}
      orgProfile={getOrgByIdData?.getOrgById}
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
      isArchivedPod={isArchivedPod}
      handleArchivePodClick={handleArchivePodClick}
      handleUnarchivePodClick={handleUnarchivePodClick}
      onDeleteImage={deleteImage}
    />
  );
}

function GeneralSettings() {
  const [logoImage, setLogoImage] = useState('');
  const [orgProfile, setOrgProfile] = useState(null);
  const [headerImage, setHeaderImage] = useState('');
  const [orgLinks, setOrgLinks] = useState([]);
  const [descriptionText, setDescriptionText] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });
  const [isPrivate, setIsPrivate] = useState(null);
  const { setPageData } = usePageDataContext();
  const router = useRouter();
  const { orgId } = router.query;

  function setOrganization(organization) {
    setLogoImage(organization?.profilePicture || '');
    setHeaderImage(organization?.headerPicture || '');
    const links = reduceLinks(organization.links);

    setOrgLinks(links);
    setDescriptionText(organization.description);

    setOrgProfile(organization);
    setIsPrivate(organization.privacyLevel === PRIVACY_LEVEL.private);
  }

  const [getOrgById, { data: getOrgByIdData }] = useLazyQuery(GET_ORG_BY_ID, {
    onCompleted: ({ getOrgById }) => {
      setPageData({ orgData: getOrgById });
      setOrganization(getOrgById);
    },
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
      setToast((prevToast) => ({
        ...prevToast,
        message: prevToast.message || 'Organization settings updated successfully.',
        show: true,
      }));
    },
  });

  function handleImageFile(file) {
    if (!file) return { filename: null, fileType: null, file: null };
    const fileName = file?.name;
    // get image preview
    const { fileType, filename } = getFilenameAndType(fileName);
    const imageFile = `tmp/${orgId}/${filename}`;
    return { filename: imageFile, fileType, file };
  }

  async function handleImageChange(file, imageType) {
    const type = {
      header: {
        setState: (file) => setHeaderImage(file),
        orgProfileKey: ImageKeyEnums.headerPicture,
      },
      profile: {
        setState: (file) => setLogoImage(file),
        orgProfileKey: ImageKeyEnums.profilePicture,
      },
    };
    const { setState, orgProfileKey } = type[imageType];
    setState(file);
    const imageFile = handleImageFile(file);
    setOrgProfile({
      ...orgProfile,
      [orgProfileKey]: file === '' ? getOrgByIdData.getOrgById[orgProfileKey] : imageFile.filename ?? null,
    });
    if (imageFile.filename) {
      await uploadMedia(imageFile);

      let message = '';
      if (imageType === ImageTypes.header) {
        message = 'Header cover profile updated successfully';
      }
      if (imageType === ImageTypes.profile) {
        message = 'Logo profile updated successfully';
      }
      setToast((prevToast) => ({ ...prevToast, message }));

      updateOrg({
        variables: {
          orgId,
          input: {
            headerPicture: imageType === ImageTypes.header ? imageFile.filename : orgProfile.headerPicture,
            profilePicture: imageType === ImageTypes.profile ? imageFile.filename : orgProfile.profilePicture,
          },
        },
      });
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
    setOrganization(getOrgByIdData?.getOrgById);
  }

  function saveChanges() {
    const links = Object.values(orgLinks);
    setToast((prevToast) => ({ ...prevToast, message: 'Organization settings updated successfully.' }));
    updateOrg({
      variables: {
        orgId,
        input: {
          links,
          name: orgProfile.name,
          description: orgProfile.description,
          privacyLevel: isPrivate ? PRIVACY_LEVEL.private : PRIVACY_LEVEL.public,
          headerPicture: orgProfile.headerPicture,
          profilePicture: orgProfile.profilePicture,
        },
      },
    });
  }

  function deleteImage(imageType: ImageKeyEnums) {
    let message = '';
    if (imageType === ImageKeyEnums.headerPicture) {
      message = 'Header cover profile deleted successfully';
    }
    if (imageType === ImageKeyEnums.profilePicture) {
      message = 'Logo profile deleted successfully';
    }
    setToast((prevToast) => ({ ...prevToast, message }));

    updateOrg({
      variables: {
        orgId,
        input: {
          headerPicture: imageType === ImageKeyEnums.headerPicture ? null : orgProfile.headerPicture,
          profilePicture: imageType === ImageKeyEnums.profilePicture ? null : orgProfile.profilePicture,
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
      orgProfile={getOrgByIdData?.getOrgById}
      links={orgLinks}
      logoImage={logoImage}
      newProfile={orgProfile}
      resetChanges={resetChanges}
      isPrivate={isPrivate}
      setIsPrivate={setIsPrivate}
      saveChanges={saveChanges}
      typeText="Organization"
      setProfile={setOrgProfile}
      headerImage={headerImage}
      handleImageChange={handleImageChange}
      onDeleteImage={deleteImage}
    />
  );
}

export default GeneralSettings;
