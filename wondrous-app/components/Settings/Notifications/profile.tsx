import React, { useContext, useEffect, useRef, useState } from 'react';
import { SettingsWrapper } from '../settingsWrapper';
import { HeaderBlock } from '../headerBlock';
import { ImageUpload } from '../imageUpload';
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
  GeneralSettingsIntegrationsBlockButtonIcon,
  GeneralSettingsResetButton,
  GeneralSettingsSaveChangesButton,
  LabelBlock,
  DiscordText,
} from '../styles';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_USER } from '../../../graphql/mutations';
import { getFilenameAndType, uploadMedia } from '../../../utils/media';
import { ProfilePictureDiv } from '../../Onboarding/styles';
import { SafeImage } from '../../Common/Image';
import { CHAR_LIMIT_PROFILE_BIO, USERNAME_REGEX, validateEmail } from '../../../utils/constants';
import { ErrorText } from '../../Common';
import Switch from '../../Common/Switch';
import { SnackbarAlertContext } from '../../../components/Common/SnackbarAlert';
import { getDiscordUrl } from '../../../utils';
import { GET_USER_DISCORD_NOTIFICATION_CONFIGS } from 'graphql/queries';
import { ENABLE_USER_DISCORD_NOTIFICATION_CONFIG, DISABLE_USER_DISCORD_NOTIFICATION_CONFIG } from 'graphql/mutations';
import {
  UserDiscordNotificationSettingsDiv,
  UserDiscordNotificationSettingsText,
  LoggedInDiscordUserText,
  ExplanationText,
} from './styles';
import Link from 'next/link';
import { White } from 'theme/colors';

const discordUrl = getDiscordUrl();

const ProfileSettings = (props) => {
  const { loggedInUser } = props;
  const [username, setUsername] = useState(loggedInUser?.username);
  const [email, setEmail] = useState(loggedInUser?.userInfo?.email);
  const [profilePictureUrl, setProfilePictureUrl] = useState(loggedInUser?.profilePicture);
  const [profileBannerUrl, setProfileBannerUrl] = useState(loggedInUser?.headerPicture);
  const [notificationOn, setNotificationOn] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profileBanner, setProfileBanner] = useState(null);
  const [mutationError, setMutationError] = useState(null);
  const [profileBio, setProfileBio] = useState(loggedInUser?.bio);
  const [updateUserProfile] = useMutation(UPDATE_USER);
  const { data: userNotificationConfigData } = useQuery(GET_USER_DISCORD_NOTIFICATION_CONFIGS);
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;
  const [errors, setErrors] = useState({
    username: null,
    email: null,
  });
  const [enableDiscordNotification] = useMutation(ENABLE_USER_DISCORD_NOTIFICATION_CONFIG, {
    onCompleted: (data) => {
      setNotificationOn(true);
    },
    onError: (e) => {
      console.error(e);
      setMutationError('error enabling notifications');
    },
  });
  const [disableDiscordNotification] = useMutation(DISABLE_USER_DISCORD_NOTIFICATION_CONFIG, {
    onCompleted: (data) => {
      setNotificationOn(false);
    },
    onError: (e) => {
      console.error(e);
      setMutationError('error disabling notifications');
    },
  });

  useEffect(() => {
    if (userNotificationConfigData?.getUserNotificationSetting?.discordEnabled) {
      setNotificationOn(true);
    }
  }, [userNotificationConfigData]);

  const handleEnableDisableSwitch = async () => {
    setMutationError(null);
    if (notificationOn) {
      const confirmed = confirm('Are you sure you want to disable discord channel notfications?');
      if (!confirmed) {
        return;
      }
    }
    if (notificationOn) {
      disableDiscordNotification();
    }

    if (!notificationOn) {
      enableDiscordNotification({
        variables: {},
      });
    }
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
    // Only if username is there...
    if (!USERNAME_REGEX.test(username)) {
      setErrors({
        ...errors,
        username: 'Please enter a valid username with 3-15 alphanumeric characters',
      });
    } else if (!validateEmail(email)) {
      setErrors({
        ...errors,
        email: 'Please enter a valid email',
      });
    } else {
      if (username) {
        let input = {
          ...(username && {
            username,
          }),
          ...(profileBio && {
            bio: profileBio,
          }),
        };
        if (email !== loggedInUser?.email) {
          input['email'] = email;
        }
        if (profilePicture) {
          const file = profilePicture;
          const fileName = profilePicture.name;

          // get image preview
          const { fileType, filename } = getFilenameAndType(fileName);
          const imagePrefix = `tmp/${loggedInUser?.id}/`;
          const imageUrl = imagePrefix + filename;

          await uploadMedia({ filename: imageUrl, fileType, file });
          input['profilePicture'] = imageUrl;
        }

        // ----> Backend not Ready yet...
        //   if(profileBanner) {
        //     const file = profileBanner;
        //     const fileName = profileBanner.name;

        //     // get image preview
        //     const { fileType, filename } = getFilenameAndType(fileName);
        //     const imagePrefix = `tmp/${loggedInUser?.id}/`;
        //     const imageUrl = imagePrefix + filename;

        //     await uploadMedia({ filename: imageUrl, fileType, file });
        //     input['headerPicture'] = imageUrl;
        //   }

        updateUserProfile({
          variables: {
            input,
          },
          onCompleted: (data) => {
            if (data?.updateUser?.profilePicture) {
              setProfilePictureUrl(data?.updateUser?.profilePicture);
            }
            setSnackbarAlertOpen(true);
            setSnackbarAlertMessage(<>User profile updated successfully</>);
          },
        });
      }
    }
  };

  return (
    <SettingsWrapper>
      <GeneralSettingsContainer>
        <HeaderBlock title="Notification settings" description="Update Notification settings." />

        <GeneralSettingsInputsBlock>
          <UserDiscordNotificationSettingsDiv>
            <UserDiscordNotificationSettingsText>Discord Notifications</UserDiscordNotificationSettingsText>
            {loggedInUser?.userInfo?.discordUsername && (
              <Switch checked={notificationOn} onChange={(e) => handleEnableDisableSwitch()} />
            )}
          </UserDiscordNotificationSettingsDiv>
          {loggedInUser?.userInfo?.discordUsername ? (
            <LoggedInDiscordUserText>{loggedInUser?.userInfo?.discordUsername}</LoggedInDiscordUserText>
          ) : (
            <LoggedInDiscordUserText
              style={{
                color: White,
              }}
            >
              {' '}
              Please connect your discord <Link href="/profile/settings">here</Link> first
            </LoggedInDiscordUserText>
          )}
          <ExplanationText>
            Currently you will receive payment, task assignment, and review request notifications
          </ExplanationText>
        </GeneralSettingsInputsBlock>

        {/* <GeneralSettingsInputsBlock>
          {profileBannerUrl ? (
            <ProfilePictureDiv>
              <LabelBlock>Profile Banner</LabelBlock>
              <SafeImage
                src={profileBannerUrl}
                style={{
                  width: '1350px',
                  height: '259px',
                  borderRadius: '6px',
                }}
              />
              <ProfilePictureAdd
                onClick={() => {
                  // restart the profile picture addition
                  setProfileBannerUrl(null);
                  setProfileBanner(null);
                }}
                style={{
                  position: 'absolute',
                  marginLeft: '-16px',
                  cursor: 'pointer',
                }}
              />
            </ProfilePictureDiv>
          ) : (
            <ImageUpload
              image={profileBanner}
              imageWidth={1350}
              imageHeight={259}
              imageName="Profile Banner"
              updateFilesCb={setProfileBanner}
            />
          )}
        </GeneralSettingsInputsBlock> */}
        {/* <GeneralSettingsButtonsBlock>
          <GeneralSettingsResetButton>Reset changes</GeneralSettingsResetButton>
          <GeneralSettingsSaveChangesButton
            buttonInnerStyle={{
              fontFamily: 'Space Grotesk',
              fontWeight: 'bold',
            }}
            highlighted
            onClick={handleSaveChanges}
          >
            Save changes
          </GeneralSettingsSaveChangesButton>
        </GeneralSettingsButtonsBlock> */}
      </GeneralSettingsContainer>
    </SettingsWrapper>
  );
};

export default ProfileSettings;
