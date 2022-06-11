import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  UsernameTitle,
  UsernameDescription,
  UsernameInput,
  ProfilePictureDiv,
  RemovePictureBtn,
} from '../styles';
import { FileLoading } from 'components/Common/FileUpload/FileUpload';

import { useRouter } from 'next/router';

import { useMe } from '../../Auth/withAuth';
import { HighlightBlue } from '../../../theme/colors';
import { getFilenameAndType, uploadMedia } from 'utils/media';
import { SafeImage } from '../../Common/Image';
import ProfilePictureAdd from '../../../public/images/onboarding/profile-picture-add.svg';
import { USERNAME_REGEX } from 'utils/constants';
import OnboardingLayout from 'components/Onboarding/OnboardingLayout';

export const OnboardingBuildProfile = ({ updateUser }) => {
  const router = useRouter();
  const [bio, setBio] = useState('');
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const user = useMe();
  const [image, setImage] = useState('');
  const inputRef: any = useRef();
  const [error, setError] = useState('');
  const handleFile = useCallback(
    async (event) => {
      const file = event.target.files[0];
      if (file) {
        setFileUploadLoading(true);
        const fileName = file?.name;
        // get image preview
        const { fileType, filename } = getFilenameAndType(fileName);
        const imagePrefix = `tmp/${user?.id}/`;
        const imageUrl = imagePrefix + filename;
        await uploadMedia({ filename: imageUrl, fileType, file });

        updateUser({
          variables: {
            input: {
              profilePicture: imageUrl,
            },
          },
          onCompleted: (data) => {
            setFileUploadLoading(false);
            if (data?.updateUser?.profilePicture) {
              setImage(data?.updateUser?.profilePicture);
            }
          },
        });
      }
    },
    [updateUser, user?.id]
  );

  const handleContinueClick = () => {
    if (bio && user?.bio === bio) {
      router.push('/onboarding/build-profile', undefined, {
        shallow: true,
      });
    } else {
      if (USERNAME_REGEX.test(bio)) {
        updateUser({
          variables: {
            input: {
              bio,
            },
          },
          onError: (e) => {
            setError(e.message);
          },
        });
      } else {
        setError("Please enter a valid bio with 3-15 alphanumeric characters with no '.'");
      }
    }
  };

  const onLaterClick = () => {
    updateUser({
      variables: {
        input: {
          bio,
        },
      },
      onCompleted: () => {
        router.push('/onboarding/connect-discord', undefined, {
          shallow: true,
        });
      },
    });
  };

  const onBackClick = () => {
    router.push('/onboarding/welcome', undefined, {
      shallow: true,
    });
  };

  useEffect(() => {
    if (user?.profilePicture) {
      setImage(user?.profilePicture);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.profilePicture]);
  // @ts-ignore
  return (
    <OnboardingLayout
      title="Welcome to Wonder"
      description="Set up your account so you can begin contributing."
      onContinueClick={handleContinueClick}
      onBackClick={onBackClick}
      onLaterClick={onLaterClick}
      step={2}
    >
      <div>
        <UsernameTitle>Enter your bio</UsernameTitle>
        <UsernameDescription>Who are you, what do you do in 1 sentence.</UsernameDescription>
        <UsernameInput
          type="text"
          name="username"
          value={bio}
          onChange={(e) => {
            if (e.target.value?.length < 200) {
              setBio(e.target.value);
            }
          }}
          placeholder="Enter your bio"
          required
        />
        <UsernameTitle
          style={{
            marginTop: '41px',
            display: 'flex',
          }}
        >
          <span>Profile picture</span>
          {fileUploadLoading && <FileLoading />}
        </UsernameTitle>

        <UsernameDescription>(Recommended 52 x 52)</UsernameDescription>

        {image ? (
          <ProfilePictureDiv>
            <SafeImage
              src={image}
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '26px',
              }}
            />
            <ProfilePictureAdd
              onClick={() => {
                inputRef.current.click();
              }}
              style={{
                position: 'absolute',
                marginLeft: '-16px',
                cursor: 'pointer',
              }}
            />
            <input type="file" hidden ref={inputRef} onChange={handleFile} />
            <RemovePictureBtn
              onClick={() => {
                setImage('');
              }}
            >
              Remove
            </RemovePictureBtn>
          </ProfilePictureDiv>
        ) : (
          <>
            <UsernameDescription
              style={{
                color: HighlightBlue,
                textDecoration: 'underline',
                cursor: 'pointer',
                marginTop: '0',
              }}
              onClick={() => {
                inputRef.current.click();
              }}
            >
              Upload new profile picture
            </UsernameDescription>
            <input type="file" hidden ref={inputRef} onChange={handleFile} />
          </>
        )}
      </div>
    </OnboardingLayout>
  );
};

