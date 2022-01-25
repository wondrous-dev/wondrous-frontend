import React, { useEffect, useRef, useState } from 'react';
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
  GeneralSettingsResetButton,
  GeneralSettingsSaveChangesButton,
  LabelBlock,
} from './styles';
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '../../graphql/mutations';
import { getFilenameAndType, uploadMedia } from '../../utils/media';
import { ProfilePictureDiv } from '../Onboarding/styles';
import { SafeImage } from '../Common/Image';
import ProfilePictureAdd from '../../public/images/onboarding/profile-picture-add.svg';
import { CHAR_LIMIT_PROFILE_BIO } from '../../utils/constants';

const ProfileSettings = (props) => {
  const { loggedInUser } = props;
  const [username, setUsername] = useState(loggedInUser?.username);
  const [profilePictureUrl, setProfilePictureUrl] = useState(loggedInUser?.profilePicture);
  const [profileBannerUrl, setProfileBannerUrl] = useState(loggedInUser?.headerPicture);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profileBanner, setProfileBanner] = useState(null);
  const [profileBio, setProfileBio] = useState(loggedInUser?.bio);
  const [updateUserProfile] = useMutation(UPDATE_USER);
  
  const handleUsernameChange = (e) => {
    const { value } = e.target;
    setUsername(value);
  };

  const handleProfileBioChange = (e) => {
    const { value } = e.target;
    setProfileBio(value);
  };

  const handleSaveChanges = async () => {
    // Only if username is there...
    if (username) {
      let input = {
        username,
        bio: profileBio,
      };

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
        },
      });
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
        <GeneralSettingsInputsBlock>
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
