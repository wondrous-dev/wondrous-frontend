import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  InviteWelcomeBoxParagraph,
  InviteWelcomeBoxWrapper,
  LogoDiv,
  LogoText,
  StyledHr,
  OnboardingTitle,
  ContinueButton,
  UsernameTitle,
  UsernameDescription,
  UsernameInput,
  ProfilePictureDiv,
} from './styles';
import WonderLogo from '../../public/images/onboarding/wonder-logo.svg';
import { FileLoading } from '../../components/Common/FileUpload/FileUpload';

import { useRouter } from 'next/router';

import { SecondStep } from '../../components/Common/Image/OnboardingProgressBar';
import { useMe } from '../Auth/withAuth';
import { HighlightBlue } from '../../theme/colors';
import { getFilenameAndType, uploadMedia } from '../../utils/media';
import { SafeImage } from '../Common/Image';
import ProfilePictureAdd from '../../public/images/onboarding/profile-picture-add.svg';

export const Logo = ({ divStyle }) => {
  return (
    <LogoDiv style={divStyle}>
      <WonderLogo />
      <LogoText>Wonder</LogoText>
    </LogoDiv>
  );
};

export const InviteWelcomeBox = ({ updateUser }) => {
  const router = useRouter();
  const [bio, setBio] = useState('');
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const user = useMe();
  const [image, setImage] = useState('');
  const inputRef: any = useRef();
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
  const buttonStyle = {
    background: 'linear-gradient(270deg, #CCBBFF -5.62%, #7427FF 45.92%, #00BAFF 103.12%)',
    position: 'relative',
    marginTop: '24px',
    bottom: '0',
    right: '0',
  };

  useEffect(() => {
    if (user?.profilePicture) {
      setImage(user?.profilePicture);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.profilePicture]);
  return (
    <InviteWelcomeBoxWrapper>
      <Logo
        divStyle={{
          position: 'relative',
          top: 0,
          left: 0,
          width: '100%',
          marginBottom: '26px',
        }}
      />
      <StyledHr />
      <SecondStep
        style={{
          width: '100%',
          marginTop: '24px',
        }}
      />
      <OnboardingTitle
        style={{
          textAlign: 'left',
          marginTop: '36px',
          width: '100%',
        }}
      >
        Build your profile
      </OnboardingTitle>
      <InviteWelcomeBoxParagraph
        style={{
          textAlign: 'left',
          width: '100%',
        }}
      >
        Set up your account so you can begin contributing.
      </InviteWelcomeBoxParagraph>
      <UsernameTitle>Enter your bio</UsernameTitle>
      <UsernameDescription>A sentence or two about you.</UsernameDescription>
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
          marginTop: '28px',
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
      <div
        style={{
          width: '100%',
          justifyContent: 'end',
          display: 'flex',
        }}
      >
        <ContinueButton
          style={buttonStyle}
          onClick={() =>
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
            })
          }
          buttonInnerStyle={{
            padding: '8px 16px',
          }}
        >
          <InviteWelcomeBoxParagraph>Continue</InviteWelcomeBoxParagraph>
        </ContinueButton>
      </div>
    </InviteWelcomeBoxWrapper>
  );
};
