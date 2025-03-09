import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FileLoading } from 'components/Common/FileUpload/FileUpload';

import { useRouter } from 'next/router';
import { AVATAR_EDITOR_TYPES } from 'constants/avatarEditor';
import palette from 'theme/palette';
import { getFilenameAndType, uploadMedia } from 'utils/media';
import OnboardingLayout from 'components/Onboarding/OnboardingLayout';
import ImageUpload from 'components/Settings/imageUpload';
import { useMe } from '../../Auth/withAuth';
import { UsernameTitle, UsernameDescription, UsernameInput, ErrorText } from '../styles';

function OnboardingBuildProfile({ updateUser }) {
  const router = useRouter();
  const { collabInvite } = router.query;
  const [bio, setBio] = useState('');
  const user = useMe();
  const [error, setError] = useState('');
  const collabInviteQueryString = collabInvite ? `?collabInvite=${collabInvite}` : '';

  useEffect(() => {
    if (user?.bio) {
      setBio(user?.bio);
    }
  }, [user?.bio]);

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

  const updateImage = (imageUrl: string | null, successMessage?: string) => {
    const message = successMessage || 'User profile picture uploaded successfully';

    updateUser({
      variables: {
        input: {
          profilePicture: imageUrl,
        },
      },
    });
  };

  async function uploadImage(file) {
    const fileName = file.name;
    // get image preview
    const { fileType, filename } = getFilenameAndType(fileName);

    const imagePrefix = `tmp/${user?.id}/`;
    const imageUrl = imagePrefix + filename;

    await uploadMedia({ filename: imageUrl, fileType, file });

    updateImage(imageUrl);
  }

  function deleteImage() {
    updateImage(null, 'User profile picture deleted successfully.');
  }

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
        </UsernameTitle>

        <ImageUpload
          imageType={AVATAR_EDITOR_TYPES.ICON_IMAGE}
          image={user?.profilePicture}
          title=""
          updateFilesCb={uploadImage}
          avatarEditorTitle="Upload a profile image"
          onDeleteImage={deleteImage}
        />

        {error && <ErrorText>{error}</ErrorText>}
      </div>
    </OnboardingLayout>
  );
}

export default OnboardingBuildProfile;
