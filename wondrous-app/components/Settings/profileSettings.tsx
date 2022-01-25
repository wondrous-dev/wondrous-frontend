import React, { useEffect, useRef, useState } from 'react';
import { SettingsWrapper } from './settingsWrapper';
import { HeaderBlock } from './headerBlock';
import { ImageUpload } from './imageUpload';
import {
  GeneralSettingsButtonsBlock,
  GeneralSettingsContainer,
  GeneralSettingsDAODescriptionBlock,
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

const ProfileSettings = (props) => {
  const { loggedInUser } = props;
  const [username, setUsername] = useState(loggedInUser?.username);
  const [profilePictureUrl, setProfilePictureUrl] = useState(loggedInUser?.profilePicture)
  const [profilePicture, setProfilePicture] = useState(null)
  const [updateUserProfile] = useMutation(UPDATE_USER)
  const inputRef: any = useRef()

  const handleUsernameChange = (e) => {
    const { value } = e.target;
    setUsername(value);
  };

  const handleSaveChanges = async () => {
    // Only if username is there...
    if (username) {
      let input = {
        username,
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

      updateUserProfile({
        variables: {
          input,
        },
        onCompleted: (data) => {
            if (data?.updateUser?.profilePicture) {
                setProfilePictureUrl(data?.updateUser?.profilePicture)
            }
        }
      })
    }
  }

  return (
    <SettingsWrapper>
      <GeneralSettingsContainer>
        <HeaderBlock title="Profile page overview" description="Update profile page settings." />
        <GeneralSettingsInputsBlock>
          <GeneralSettingsDAODescriptionBlock>
            <LabelBlock>Username</LabelBlock>
            <GeneralSettingsDAONameInput value={username} onChange={handleUsernameChange} />
          </GeneralSettingsDAODescriptionBlock>
        </GeneralSettingsInputsBlock>
        {profilePictureUrl ? (
          <ProfilePictureDiv style={{ marginTop: '20px' }}>
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
                setProfilePictureUrl(null)
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
