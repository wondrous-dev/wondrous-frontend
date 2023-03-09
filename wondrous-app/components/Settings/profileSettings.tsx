/* eslint-disable dot-notation */
import { useMutation } from '@apollo/client';
import LinkBigIcon from 'components/Icons/link';
import OpenSeaIcon from 'components/Icons/openSea';
import cloneDeep from 'lodash/cloneDeep';
import React, { useContext, useEffect, useState } from 'react';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import useAlerts from 'hooks/useAlerts';
import { UPDATE_USER, USER_DISCORD_DISCONNECT } from 'graphql/mutations';
import { getDiscordUrl } from 'utils';
import { ImageTypes, ImageKeyEnums } from 'types/common';
import {
  CHAR_LIMIT_PROFILE_BIO,
  DISCORD_CONNECT_TYPES,
  USERNAME_REGEX,
  validateEmail,
  TWITTER_CHALLENGE_CODE,
} from 'utils/constants';
import { getFilenameAndType, uploadMedia } from 'utils/media';
import Tooltip from 'components/Tooltip';
import { useRouter } from 'next/router';
import { buildTwitterAuthUrl } from 'components/Twitter/utils';
import CloseModalIcon from 'components/Icons/closeModal';
import SettingsWrapper from 'components/Common/SidebarSettings';
import HeaderBlock from 'components/Settings/headerBlock';
import { GET_LOGGED_IN_USER } from 'graphql/queries';
import { AVATAR_EDITOR_TYPES } from 'constants/avatarEditor';
import { CYBER_CONNECT_HANDLE_STORAGE, cyberConnectSignin, getHandle } from 'components/Common/CyberConnect/api';
import { useWonderWeb3 } from 'services/web3';
import { ErrorText } from '../Common';
import ImageUpload from './imageUpload';
import { InputField } from './inputField';
import { LinkSquareIcon } from './linkSquareIcon';
import {
  GeneralSettingsButtonsBlock,
  GeneralSettingsContainer,
  GeneralSettingsDAODescriptionBlock,
  GeneralSettingsDAODescriptionInput,
  GeneralSettingsDAODescriptionInputCounter,
  GeneralSettingsDAONameBlock,
  GeneralSettingsDAONameInput,
  GeneralSettingsInputsBlock,
  GeneralSettingsIntegrationsBlockButton,
  GeneralSettingsDiscordIcon,
  GeneralSettingsTwitterIcon,
  GeneralSettingsResetButton,
  GeneralSettingsSaveChangesButton,
  GeneralSettingsSocialsBlock,
  GeneralSettingsSocialsBlockRow,
  GeneralSettingsSocialsBlockWrapper,
  LabelBlock,
  GeneralSettingsCyberConnectIcon,
} from './styles';

const discordUrl = getDiscordUrl();
const socialsData = [
  {
    icon: <OpenSeaIcon />,
    link: 'https://opensea.io/',
    type: 'opensea',
  },
];

const setLinkTypeWebsite = (links) => {
  const defaultTypeLink = [
    {
      type: 'website',
      url: '',
      displayName: '',
    },
  ];
  const linkTypeLinks = links?.filter((i) => i.type === 'website') ?? defaultTypeLink;
  const linkTypeData = linkTypeLinks?.length > 0 ? linkTypeLinks : defaultTypeLink;
  return linkTypeData;
};

const updateLinks = ({ links, url, item }) => {
  const unchangedLinks = cloneDeep(links)?.filter((link) => link.type !== item.type) ?? [];
  const updatedLink = {
    url,
    displayName: url,
    type: item.type,
  };
  const updatedLinks = unchangedLinks.concat(updatedLink).filter((i) => i.url !== '');
  return updatedLinks;
};

const useLoggedInUserLinks = (userLinks) => {
  const [links, setLinks] = useState();
  useEffect(() => {
    setLinks(
      // NOTE: __typename needs to be removed from the links because it will cause an error during the mutation
      userLinks?.map(({ __typename, ...userLinks }) => ({ ...userLinks }))
    );
  }, [userLinks]);
  return [links, setLinks];
};

function SettingsLinks({ links, setLinks }) {
  const linkTypeWebsite = setLinkTypeWebsite(links);
  const handleLinkChange = (event, item) => {
    const url = event.currentTarget.value;
    setLinks(updateLinks({ links, url, item }));
  };
  return (
    <>
      <GeneralSettingsSocialsBlock
        style={{
          paddingTop: '0',
        }}
      >
        <LabelBlock>Socials</LabelBlock>
        <GeneralSettingsSocialsBlockWrapper>
          {socialsData.map((item) => {
            const value = links?.filter((i) => i.type === item.type)[0]?.url;
            return (
              <GeneralSettingsSocialsBlockRow key={item.type}>
                <LinkSquareIcon title={item.type} icon={item.icon} />
                <InputField value={value} onChange={(e) => handleLinkChange(e, item)} />
              </GeneralSettingsSocialsBlockRow>
            );
          })}
        </GeneralSettingsSocialsBlockWrapper>
      </GeneralSettingsSocialsBlock>
      <GeneralSettingsSocialsBlock>
        <LabelBlock>Links</LabelBlock>
        <GeneralSettingsSocialsBlockWrapper>
          {linkTypeWebsite.map((link) => (
            <GeneralSettingsSocialsBlockRow key={link.type}>
              <LinkSquareIcon title="Link" icon={<LinkBigIcon />} />
              <InputField value={link.url} onChange={(e) => handleLinkChange(e, link)} />
            </GeneralSettingsSocialsBlockRow>
          ))}
        </GeneralSettingsSocialsBlockWrapper>
      </GeneralSettingsSocialsBlock>
    </>
  );
}

function ProfileSettings(props) {
  const { loggedInUser } = props;
  const router = useRouter();
  const { discordUserExists, discordError } = router.query;
  const { signMessage, address } = useWonderWeb3();
  const [username, setUsername] = useState(loggedInUser?.username);
  const [email, setEmail] = useState(loggedInUser?.userInfo?.email);
  const [profilePictureUrl, setProfilePictureUrl] = useState(loggedInUser?.profilePicture);
  const [profileHeaderUrl, setProfileHeaderUrl] = useState(loggedInUser?.headerPicture);
  const [profileBio, setProfileBio] = useState(loggedInUser?.bio);
  const [updateUserProfile] = useMutation(UPDATE_USER);
  const [disconnectDiscord] = useMutation(USER_DISCORD_DISCONNECT, {
    refetchQueries: [GET_LOGGED_IN_USER],
  });
  const { showError } = useAlerts();
  const [cyberConnectHandleConnected, setCyberConnectHandleConnected] = useState('');
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;
  const setSnackbarAlertSeverity = snackbarContext?.setSnackbarAlertSeverity;
  const [errors, setErrors] = useState({
    username: null,
    email: null,
    description: null,
  });
  const [links, setLinks] = useLoggedInUserLinks(loggedInUser?.links);
  const handleUsernameChange = (e) => {
    const { value } = e.target;
    setUsername(value);
  };
  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
  };
  const handleProfileBioChange = (e) => {
    const { value } = e.target;
    if (value.length <= 200) setErrors({ ...errors, description: null });
    setProfileBio(value);
  };
  useEffect(() => {
    if (loggedInUser?.username) {
      setUsername(loggedInUser?.username);
    }
    if (loggedInUser?.userInfo?.email) {
      setEmail(loggedInUser?.userInfo?.email);
    }
    if (loggedInUser?.bio) {
      setProfileBio(loggedInUser?.bio);
    }
  }, [loggedInUser?.username, loggedInUser?.userInfo?.email, loggedInUser?.bio]);

  const handleSaveChanges = async () => {
    if (!USERNAME_REGEX.test(username)) {
      setErrors({
        ...errors,
        username: 'Please enter a valid username with 3-15 alphanumeric characters',
      });
      return;
    }

    if (email && !validateEmail(email)) {
      setErrors({
        ...errors,
        email: 'Please enter a valid email',
      });
      return;
    }

    if (profileBio && profileBio.length > 200) {
      setErrors({
        ...errors,
        description: 'The description should not exceed 200 characters',
      });
      return;
    }

    if (!username) {
      return;
    }

    const input = {
      ...(profileBio && {
        bio: profileBio,
      }),
      links,
    };

    if (username !== loggedInUser?.username) {
      input['username'] = username;
    }
    if (email !== loggedInUser?.email) {
      input['email'] = email;
    }

    updateUserProfile({
      variables: {
        input: {
          ...input,
          profilePicture: loggedInUser?.profilePicture,
        },
      },
      onCompleted: (data) => {
        setProfilePictureUrl(data?.updateUser?.profilePicture);
        setSnackbarAlertSeverity('success');
        setSnackbarAlertOpen(true);
        setSnackbarAlertMessage(<>User profile updated successfully</>);
      },
      onError: (error) => {
        showError(error?.message, true);
      },
    });
  };

  const redirectToTwitterAuth = () => {
    const url = buildTwitterAuthUrl(TWITTER_CHALLENGE_CODE, 'profile');
    window.open(url);
  };

  const updateImage = (imageUrl: string | null, successMessage?: string) => {
    const message = successMessage || 'User profile picture uploaded successfully';
    updateUserProfile({
      variables: {
        input: {
          profilePicture: imageUrl,
        },
      },
      onCompleted: (data) => {
        setProfilePictureUrl(data?.updateUser?.profilePicture);
        setSnackbarAlertSeverity('success');
        setSnackbarAlertOpen(true);
        setSnackbarAlertMessage(message);
      },
    });
  };

  const updateHeaderImage = (imageUrl: string | null, successMessage?: string) => {
    const message = successMessage || 'User header picture uploaded successfully';

    updateUserProfile({
      variables: {
        input: {
          headerPicture: imageUrl,
        },
      },
      onCompleted: (data) => {
        setProfileHeaderUrl(data?.updateUser?.headerPicture);
        setSnackbarAlertSeverity('success');
        setSnackbarAlertOpen(true);
        setSnackbarAlertMessage(message);
      },
    });
  };

  async function uploadImage(file, imageType = ImageTypes.profile) {
    const fileName = file.name;
    // get image preview
    const { fileType, filename } = getFilenameAndType(fileName);

    const imagePrefix = `tmp/${loggedInUser?.id}/`;
    const imageUrl = imagePrefix + filename;

    await uploadMedia({ filename: imageUrl, fileType, file });
    console.log('imageType', imageType);
    if (imageType === ImageTypes.profile) {
      updateImage(imageUrl);
    }
    if (imageType === ImageTypes.header) {
      updateHeaderImage(imageUrl);
    }
  }

  function deleteImage(imageKey: ImageKeyEnums) {
    if (imageKey === ImageKeyEnums.profilePicture) {
      updateImage(null, 'User profile picture deleted successfully.');
    }
    if (imageKey === ImageKeyEnums.headerPicture) {
      updateHeaderImage(null, 'User header picture deleted successfully.');
    }
  }

  const cyberConnectHandle = typeof window !== 'undefined' && localStorage.getItem(CYBER_CONNECT_HANDLE_STORAGE);

  useEffect(() => {
    if (cyberConnectHandle) {
      setCyberConnectHandleConnected(cyberConnectHandle);
    }
  }, [cyberConnectHandle]);
  return (
    <SettingsWrapper>
      <GeneralSettingsContainer>
        <HeaderBlock title="Profile page overview" description="Update profile page settings." />
        <GeneralSettingsInputsBlock>
          <GeneralSettingsDAONameBlock>
            <LabelBlock>Username</LabelBlock>
            <GeneralSettingsDAONameInput value={username} onChange={handleUsernameChange} />
            {errors.username && <ErrorText>{errors.username}</ErrorText>}
          </GeneralSettingsDAONameBlock>
          <GeneralSettingsDAONameBlock>
            <LabelBlock>Email</LabelBlock>
            <GeneralSettingsDAONameInput value={email} onChange={handleEmailChange} />
            {errors.email && <ErrorText>{errors.email}</ErrorText>}
          </GeneralSettingsDAONameBlock>
          <GeneralSettingsDAODescriptionBlock>
            <LabelBlock>Description</LabelBlock>
            <div>
              <GeneralSettingsDAODescriptionInput
                multiline
                rows={3}
                value={profileBio}
                onChange={(e) => handleProfileBioChange(e)}
              />
              <GeneralSettingsDAODescriptionInputCounter>
                {profileBio?.length || 0} / {CHAR_LIMIT_PROFILE_BIO} characters
              </GeneralSettingsDAODescriptionInputCounter>
            </div>
            {errors.description && <ErrorText>{errors.description}</ErrorText>}
          </GeneralSettingsDAODescriptionBlock>
        </GeneralSettingsInputsBlock>
        <GeneralSettingsInputsBlock
          style={{
            borderBottom: 'none',
            padding: '30px 0 0 0',
          }}
        >
          <ImageUpload
            imageType={AVATAR_EDITOR_TYPES.ICON_IMAGE}
            image={loggedInUser?.profilePicture}
            title="Profile Pic"
            updateFilesCb={(file) => uploadImage(file, ImageTypes.profile)}
            avatarEditorTitle="Upload a profile image"
            onDeleteImage={(imageKey: ImageKeyEnums) => deleteImage(ImageKeyEnums.profilePicture)}
          />

          <ImageUpload
            image={loggedInUser?.headerPicture}
            title="Header"
            imageType={AVATAR_EDITOR_TYPES.HEADER_IMAGE}
            updateFilesCb={(headerImg) => uploadImage(headerImg, ImageTypes.header)}
            avatarEditorTitle="Upload a header image"
            onDeleteImage={(imageKey: ImageKeyEnums) => deleteImage(ImageKeyEnums.headerPicture)}
          />
        </GeneralSettingsInputsBlock>

        <SettingsLinks links={links} setLinks={setLinks} />

        <GeneralSettingsInputsBlock>
          <LabelBlock
            style={{
              marginBottom: '20px',
            }}
          >
            Integrations
          </LabelBlock>

          <GeneralSettingsIntegrationsBlockButton
            style={{
              maxWidth: 'none',
              width: 'fit-content',
              ...(loggedInUser?.userInfo?.discordUsername && {
                borderRadius: '8px',
              }),
            }}
            buttonInnerStyle={{
              ...(loggedInUser?.userInfo?.discordUsername && {
                borderRadius: '8px',
              }),
            }}
            highlighted
            onClick={() => {
              if (!loggedInUser?.userInfo?.discordUsername) {
                const state = JSON.stringify({
                  callbackType: DISCORD_CONNECT_TYPES.connectSettings,
                });
                window.location.href = `${discordUrl}&state=${state}`;
              }
            }}
          >
            <Tooltip title="This integration enables Discord notifications" placement="top">
              <div
                style={{
                  display: 'flex',
                }}
              >
                <GeneralSettingsDiscordIcon />
                {loggedInUser?.userInfo?.discordUsername
                  ? `Connected to ${loggedInUser?.userInfo?.discordUsername}`
                  : 'Connect discord'}

                {loggedInUser?.userInfo?.discordUsername && (
                  <CloseModalIcon
                    style={{
                      marginLeft: '16px',
                      cursor: 'pointer',
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      disconnectDiscord();
                    }}
                  />
                )}
              </div>
            </Tooltip>
          </GeneralSettingsIntegrationsBlockButton>
          {discordUserExists && <ErrorText>Discord user already connected to another account</ErrorText>}
          {discordError && <ErrorText>Error connecting to Discord. Please try again or contact support.</ErrorText>}

          <GeneralSettingsIntegrationsBlockButton
            style={{
              marginTop: '30px',

              maxWidth: 'none',
              width: 'fit-content',
              ...(loggedInUser?.userInfo?.twitterUsername && {
                borderRadius: '8px',
              }),
            }}
            buttonInnerStyle={{
              ...(loggedInUser?.userInfo?.twitterUsername && {
                borderRadius: '8px',
              }),
            }}
            highlighted
            onClick={() => {
              if (!loggedInUser?.userInfo?.twitterUsername) {
                redirectToTwitterAuth();
              }
            }}
          >
            <Tooltip title="Connect your Twitter account" placement="top">
              <div
                style={{
                  display: 'flex',
                }}
              >
                <GeneralSettingsTwitterIcon />
                {loggedInUser?.userInfo?.twitterUsername
                  ? `Connected to ${loggedInUser?.userInfo?.twitterUsername}`
                  : 'Connect Twitter'}
              </div>
            </Tooltip>
          </GeneralSettingsIntegrationsBlockButton>
        </GeneralSettingsInputsBlock>

        <GeneralSettingsButtonsBlock>
          <GeneralSettingsResetButton>Cancel changes</GeneralSettingsResetButton>
          <GeneralSettingsSaveChangesButton highlighted onClick={handleSaveChanges}>
            Save changes
          </GeneralSettingsSaveChangesButton>
        </GeneralSettingsButtonsBlock>
      </GeneralSettingsContainer>
    </SettingsWrapper>
  );
}

export default ProfileSettings;
