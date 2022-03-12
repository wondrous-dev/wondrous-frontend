import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

import { useMe, withAuth, withWaitlistAuth } from '../../components/Auth/withAuth';
import {
  JoinWaitlistHeader,
  ProfileWrapper,
  FunkyText,
  ExplanationText,
  FunkyTextYellow,
  LinkBox,
  LinkText,
  CopyText,
  InviteButtonText,
  ReferredText,
  LinkRow,
  CenteredDiv,
  LogoNoTextImg,
  ProfileText,
  TokenEarnedDiv,
  YouHaveText,
  TokenEarnedInnerDiv,
  WonderTokenSymbol,
  InviteDiv,
  InviteButton,
  InviteButtonDiv,
  ProfileCenteredDiv,
} from '../../components/profile/email/styles';
import { Blue500, Grey800 } from '../../theme/colors';

import { NewCanvas } from '../../components/Common';
import { useIsMobile, useWindowSize } from '../../utils/hooks';
import { Logo } from '../../components/Common/ci';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { CONFIRM_EMAIL_ADDRESS } from '../../graphql/mutations';
import { CreateFormPreviewButton } from '../../components/CreateEntity/styles';
import { CircularProgress } from '@material-ui/core';

const EmailVerify = () => {
  const router = useRouter();
  const { token } = router.query;
  const [loading, setLoading] = useState(true);
  const [verifyEmail, { data }] = useMutation(CONFIRM_EMAIL_ADDRESS);
  const emailAddressConfirm = data?.confirmEmailAddress?.success;
  useEffect(() => {
    if (token && loading) {
      verifyEmail({
        variables: {
          token,
        },
      });
    }
    if (emailAddressConfirm) {
      setLoading(false);
    }
  }, [token, verifyEmail, emailAddressConfirm, data]);

  return (
    <ProfileWrapper>
      <ProfileCenteredDiv>
        <Logo />
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <JoinWaitlistHeader variant="h3">Thanks for confirming your email!</JoinWaitlistHeader>
            <CreateFormPreviewButton
              onClick={() => {
                router.push('/dashboard', undefined, {
                  shallow: true,
                });
              }}
            >
              Take me home
            </CreateFormPreviewButton>
          </>
        )}
      </ProfileCenteredDiv>
    </ProfileWrapper>
  );
};

export default withAuth(EmailVerify);
