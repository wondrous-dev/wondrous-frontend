import React, { useContext, useEffect, useRef, useState } from 'react';
import { SettingsWrapper } from './settingsWrapper';
import { HeaderBlock } from './headerBlock';
import { ImageUpload } from './imageUpload';
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
} from './styles';
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '../../graphql/mutations';
import { getFilenameAndType, uploadMedia } from '../../utils/media';
import { ProfilePictureDiv } from '../Onboarding/styles';
import { SafeImage } from '../Common/Image';
import ProfilePictureAdd from '../../public/images/onboarding/profile-picture-add.svg';
import { CHAR_LIMIT_PROFILE_BIO, USERNAME_REGEX, validateEmail } from '../../utils/constants';
import { ErrorText } from '../Common';
import { SnackbarAlertContext } from '../../components/Common/SnackbarAlert';
import { getDiscordUrl } from '../../utils';

const discordUrl = getDiscordUrl();

const ProfileSettings = (props) => {
  const { loggedInUser } = props;
  console.log('loggedin user', loggedInUser);
  const [username, setUsername] = useState(loggedInUser?.username);
  const [email, setEmail] = useState(loggedInUser?.userInfo?.email);
  const [profilePictureUrl, setProfilePictureUrl] = useState(loggedInUser?.profilePicture);
  const [profileBannerUrl, setProfileBannerUrl] = useState(loggedInUser?.headerPicture);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profileBanner, setProfileBanner] = useState(null);
  const [profileBio, setProfileBio] = useState(loggedInUser?.bio);
  const [updateUserProfile] = useMutation(UPDATE_USER);
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;
  const [errors, setErrors] = useState({
    username: null,
    email: null,
  });
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
            <GeneralSettingsDAODescriptionInput
              multiline
              rows={3}
              value={profileBio}
              onChange={(e) => handleProfileBioChange(e)}
            />
            <GeneralSettingsDAODescriptionInputCounter>
              {profileBio?.length} / {CHAR_LIMIT_PROFILE_BIO} characters
            </GeneralSettingsDAODescriptionInputCounter>
          </GeneralSettingsDAODescriptionBlock>
        </GeneralSettingsInputsBlock>
        <GeneralSettingsInputsBlock
          style={{
            borderBottom: 'none',
          }}
        >
          {profilePictureUrl ? (
            <ProfilePictureDiv>
              <LabelBlock>Profile Picture</LabelBlock>
              <SafeImage
                src={profilePictureUrl}
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '26px',
                }}
              />
              <ProfilePictureAdd
                onClick={() => {
                  // restart the profile picture addition
                  setProfilePictureUrl(null);
                  setProfilePicture(null);
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
              image={profilePicture}
              imageWidth={52}
              imageHeight={52}
              imageName="Profile Picture"
              updateFilesCb={setProfilePicture}
            />
          )}
        </GeneralSettingsInputsBlock>

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
                window.location.href = discordUrl;
              }
            }}
          >
            <GeneralSettingsIntegrationsBlockButtonIcon />
            {loggedInUser?.userInfo?.discordUsername
              ? `Connected to ${loggedInUser?.userInfo?.discordUsername}`
              : 'Connect discord'}
          </GeneralSettingsIntegrationsBlockButton>
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
        <GeneralSettingsButtonsBlock>
          <GeneralSettingsResetButton>Reset changes</GeneralSettingsResetButton>
          <GeneralSettingsSaveChangesButton highlighted onClick={handleSaveChanges}>
            Save changes
          </GeneralSettingsSaveChangesButton>
        </GeneralSettingsButtonsBlock>
      </GeneralSettingsContainer>
    </SettingsWrapper>
  );
};

export default ProfileSettings;
