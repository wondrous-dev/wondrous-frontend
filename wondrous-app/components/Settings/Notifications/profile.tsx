import React, { useContext, useEffect, useRef, useState } from 'react';
import { SettingsWrapper } from '../settingsWrapper';
import { HeaderBlock } from '../headerBlock';
import { ImageUpload } from '../imageUpload';
import {
  GeneralSettingsButtonsBlock,
  GeneralSettingsContainer,
  GeneralSettingsResetButton,
  GeneralSettingsSaveChangesButton,
  LabelBlock,
  DiscordText,
} from '../styles';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_USER } from 'graphql/mutations';
import { getFilenameAndType, uploadMedia } from 'utils/media';
import { ProfilePictureDiv } from '../../Onboarding/styles';
import { SafeImage } from '../../Common/Image';
import { CHAR_LIMIT_PROFILE_BIO, DISCORD_CONNECT_TYPES, USERNAME_REGEX, validateEmail } from 'utils/constants';
import { ErrorText } from '../../Common';
import Switch from '../../Common/Switch';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { getDiscordUrl } from 'utils';
import { GET_USER_DISCORD_NOTIFICATION_CONFIGS } from 'graphql/queries';
import {
  ENABLE_USER_DISCORD_NOTIFICATION_CONFIG,
  DISABLE_USER_DISCORD_NOTIFICATION_CONFIG,
  SET_USER_NOTIFICATION_SETTINGS,
} from 'graphql/mutations';
import {
  UserDiscordNotificationSettingsDiv,
  UserDiscordNotificationSettingsText,
  LoggedInDiscordUserText,
  ExplanationText,
  StyledCheckbox,
  NotificationSettingsCategoryLabel,
  NotificationSettingLabel,
  NotificationSettingListItem,
  NotificationSettingsHeader,
  NotificationSettingsHeaderText,
  NotificationSettingsHeaderWrapper,
  DiscordLink,
  UserDiscordNotificationSettingsContainer,
  NotificationSettingsButtonsBlock,
} from './styles';
import isEqual from 'lodash/isEqual';

const discordUrlWithoutState = getDiscordUrl();
const state = JSON.stringify({
  callbackType: DISCORD_CONNECT_TYPES.connectSettings,
});
const discordUrl = `${discordUrlWithoutState}&state=${state}`;

const notificationsConfig = [
  {
    label: 'Discussions',
    settings: [
      {
        label: 'Comment',
        id: 'onComment',
      },
    ],
  },
  {
    label: 'Membership requests',
    settings: [
      {
        label: 'New requests',
        id: 'onJoinRequest',
      },
      {
        label: 'Request status change',
        id: 'onJoinRequestStatus',
      },
    ],
  },
  {
    label: 'Assigned work',
    settings: [
      {
        label: 'Assignments',
        id: 'onTaskAssign',
      },
      {
        label: 'Signed off deliverables',
        id: 'onSubmissionsToReview',
      },
      {
        id: 'onProposalSubmissionStatus',
        label: 'Approvals and Rejections',
      },
      {
        id: 'onDueDate',
        label: 'Due date reminders',
      },
    ],
  },
  {
    label: 'Review work',
    settings: [
      {
        id: 'onTaskClaim',
        label: 'Others claiming your tasks',
      },
    ],
  },
  {
    label: 'Financial',
    settings: [
      {
        label: 'New payment',
        id: 'onPayment',
      },
    ],
  },
];

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
  const [discordNotificationSettings, setDiscordNotificationSettings] = useState({});
  const { data: userNotificationConfigData, refetch } = useQuery(GET_USER_DISCORD_NOTIFICATION_CONFIGS);
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
      setInitialSettings();
    },
    onError: (e) => {
      console.error(e);
      setMutationError('error enabling notifications');
    },
  });
  const [setUserNotificationSettings] = useMutation(SET_USER_NOTIFICATION_SETTINGS, {
    onCompleted: (data) => {
      refetch();
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage(<>Notification settings updated successfully</>);
    },
    onError: (e) => {
      console.error(e);
      setMutationError('error setting notification settings');
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

  const {
    onComment,
    onTaskAssign,
    onSubmissionsToReview,
    onProposalSubmissionStatus,
    onTaskClaim,
    onPayment,
    onJoinRequest,
    onJoinRequestStatus,
    onDueDate,
  } = userNotificationConfigData?.getUserNotificationSetting || {};

  const initialSettings = {
    onComment,
    onTaskAssign,
    onSubmissionsToReview,
    onProposalSubmissionStatus,
    onTaskClaim,
    onPayment,
    onJoinRequest,
    onJoinRequestStatus,
    onDueDate,
  };
  const setInitialSettings = () => {
    if (userNotificationConfigData?.getUserNotificationSetting) {
      setDiscordNotificationSettings(initialSettings);
    }
  };

  useEffect(() => {
    if (userNotificationConfigData?.getUserNotificationSetting?.discordEnabled) {
      setNotificationOn(true);
      setInitialSettings();
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

  const handleNotificationSettingsChange = (setting) =>
    setDiscordNotificationSettings({
      ...discordNotificationSettings,
      [setting]: !discordNotificationSettings[setting],
    });

  const saveNotificationSettings = () => {
    setUserNotificationSettings({
      variables: {
        settings: discordNotificationSettings,
      },
    });
  };

  const isDiscordConnected = loggedInUser?.userInfo?.discordUsername;

  const isSettingChanged = !isEqual(discordNotificationSettings, initialSettings);

  const canChangeSettings = !!Object.keys(discordNotificationSettings).length && notificationOn && isDiscordConnected;

  return (
    <SettingsWrapper>
      <GeneralSettingsContainer>
        <NotificationSettingsHeaderWrapper>
          <NotificationSettingsHeader>Notifications</NotificationSettingsHeader>
          <NotificationSettingsHeaderText>
            {"We'll always let you know about important changes, but you pick what else you want to hear about"}
          </NotificationSettingsHeaderText>
        </NotificationSettingsHeaderWrapper>
        <UserDiscordNotificationSettingsContainer>
          <UserDiscordNotificationSettingsDiv>
            <UserDiscordNotificationSettingsText>Discord Notifications</UserDiscordNotificationSettingsText>
            <Switch
              checked={!!(isDiscordConnected && notificationOn)}
              disabled={!isDiscordConnected}
              onChange={(e) => handleEnableDisableSwitch()}
            />
          </UserDiscordNotificationSettingsDiv>
          {isDiscordConnected ? (
            <LoggedInDiscordUserText>@{isDiscordConnected}</LoggedInDiscordUserText>
          ) : (
            <DiscordLink href={discordUrl}>Connect your Discord</DiscordLink>
          )}
          <div>
            {canChangeSettings &&
              notificationsConfig.map((category, idx) => (
                <div key={idx}>
                  <NotificationSettingsCategoryLabel>{category.label}</NotificationSettingsCategoryLabel>
                  {category.settings.map((setting) =>
                    typeof discordNotificationSettings[setting.id] === 'undefined' ? null : (
                      <NotificationSettingListItem key={setting?.id}>
                        <StyledCheckbox
                          checked={discordNotificationSettings[setting.id]}
                          onChange={() => handleNotificationSettingsChange(setting.id)}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                        <NotificationSettingLabel>{setting?.label}</NotificationSettingLabel>
                      </NotificationSettingListItem>
                    )
                  )}
                </div>
              ))}
          </div>
        </UserDiscordNotificationSettingsContainer>

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
        {isSettingChanged && isDiscordConnected && notificationOn && (
          <NotificationSettingsButtonsBlock>
            <GeneralSettingsResetButton onClick={setInitialSettings}>Reset changes</GeneralSettingsResetButton>
            <GeneralSettingsSaveChangesButton
              buttonInnerStyle={{
                fontFamily: 'Space Grotesk',
                fontWeight: 'bold',
              }}
              highlighted
              onClick={saveNotificationSettings}
            >
              Save changes
            </GeneralSettingsSaveChangesButton>
          </NotificationSettingsButtonsBlock>
        )}
      </GeneralSettingsContainer>
    </SettingsWrapper>
  );
};

export default ProfileSettings;
