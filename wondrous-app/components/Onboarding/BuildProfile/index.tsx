import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FileLoading } from 'components/Common/FileUpload/FileUpload';

import { useRouter } from 'next/router';

import palette from 'theme/palette';
import { getFilenameAndType, uploadMedia } from 'utils/media';
import OnboardingLayout from 'components/Onboarding/OnboardingLayout';
import { useMe } from '../../Auth/withAuth';
import { SafeImage } from '../../Common/Image';
import ProfilePictureAdd from '../../../public/images/onboarding/profile-picture-add.svg';
import {
  UsernameTitle,
  UsernameDescription,
  UsernameInput,
  ProfilePictureDiv,
  RemovePictureBtn,
  ErrorText,
} from '../styles';

export function OnboardingBuildProfile({ updateUser }) {
  const router = useRouter();
  const { collabInvite } = router.query;
  const [bio, setBio] = useState('');
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const user = useMe();
  const [image, setImage] = useState('');
  const inputRef: any = useRef();
  const [error, setError] = useState('');
  const collabInviteQueryString = collabInvite ? `?collabInvite=${collabInvite}` : '';

  useEffect(() => {
    if (user?.bio) {
      setBio(user?.bio);
    }
  }, [user?.bio]);

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

  const goToNextStep = () => {
    const nextStep = user?.userInfo?.email
      ? `/onboarding/discord${collabInviteQueryString}`
      : `/onboarding/email${collabInviteQueryString}`;
    router.push(nextStep, undefined, { shallow: true });
  };

  const handleContinueClick = () => {
    if (bio && user?.bio === bio) {
      goToNextStep();
    } else {
      updateUser({
        variables: {
          input: {
            bio,
          },
        },
        onCompleted: () => {
          goToNextStep();
        },
        onError: (e) => {
          setError(e.message);
        },
      });
    }
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
      onLaterClick={goToNextStep}
      onBackClick={() => router.back()}
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
              width={52}
              height={52}
              useNextImage
              style={{
                borderRadius: '26px',
                objectFit: 'cover',
              }}
              alt="Profile picture"
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
                color: palette.highlightBlue,
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

        {error && <ErrorText>{error}</ErrorText>}
      </div>
    </OnboardingLayout>
  );
}
