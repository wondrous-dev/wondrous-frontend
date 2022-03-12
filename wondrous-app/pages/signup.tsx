import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from "next/image";

import { Card, CardBody, CardFooter } from '../components/Common/auth';
import { Button } from '../components/Common/button';
import AuthLayout from '../components/Common/Layout/Auth';
import { LineWithText, Line } from '../components/Common/lines';
import { Form } from '../components/Common/form';
import { Field } from '../components/Common/field';
import { PaddedParagraph, StyledLink } from '../components/Common/text';
import { SmallLogo, LoginWrapper, TopBubble, LoginError } from '../components/Pages/login';
import { useState } from 'react';
import { CenteredFlexRow } from '../components/Common/index';
import { Grey50 } from '../theme/colors';
import { Metamask } from '../components/Icons/metamask';
import { EmailIcon, LockIcon } from '../components/Icons/userpass';
import { useWonderWeb3 } from '../services/web3';
import { emailSignup, getUserSigningMessage, walletSignup } from '../components/Auth/withAuth';
import { SupportedChainType } from '../utils/web3Constants';

const Signup = () => {
  const wonderWeb3 = useWonderWeb3();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRePassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [unsuportedChain, setUnsuportedChain] = useState(false);

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== repassword) {
      setErrorMessage('Passwords need to match');
      return false;
    }

    const result = await emailSignup(email, password);
    if (result === true) {
      router.push('/dashboard', undefined, {
        shallow: true,
      });
    } else {
      setErrorMessage(result);
    }
  };

  // Two stage process as wallet connection takes
  // time.
  const connectWallet = async (event) => {
    // Connect Wallet first
    await wonderWeb3.onConnect();
  };

  const signupWithWallet = async () => {
    if (wonderWeb3.address && wonderWeb3.chain && !wonderWeb3.connecting) {
      // Retrieve Signed Message
      const messageToSign = await getUserSigningMessage(wonderWeb3.address, SupportedChainType.ETH);

      if (messageToSign) {
        const signedMessage = await wonderWeb3.signMessage(messageToSign);

        if (signedMessage) {
          // Sign with Wallet
          const result = await walletSignup(wonderWeb3.address, signedMessage, wonderWeb3.chainName.toLowerCase());
          if (result === true) {
            router.push(`/onboarding/welcome`, undefined, {
              shallow: true,
            });
          } else {
            setErrorMessage(result);
          }
        } else if (signedMessage === false) {
          setErrorMessage('Signature rejected. Try again.');
        } else {
          setErrorMessage('There has been an issue, contact with support.');
        }
      } else {
        setErrorMessage('Signup failed - please contact support.');
      }
    }
  };

  useEffect(() => {
    if (wonderWeb3.address) {
      signupWithWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wonderWeb3.wallet]);

  return (
    <AuthLayout>
      <LoginWrapper>
        <Image
            alt="Background"
            className="auth-background"
            src="/images/login/background.png"
            layout="fill"
            objectFit="cover"
            quality={80}
        />
        <Image alt="Background" src="/images/login/background-blur.png" layout="fill" objectFit="cover" quality={80} />
        <TopBubble src="/images/login/top-floater-bubble.png" alt="" />
        <Card>
          <CardBody>
            <SmallLogo />
            <h1>Signup</h1>
            {!process.env.NEXT_PUBLIC_PRODUCTION && (
              <>
                <Form onSubmit={handleSubmit}>
                  {errorMessage ? <LoginError>{errorMessage}</LoginError> : ''}
                  <Field
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    icon={EmailIcon}
                    required
                  />
                  <Field
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    icon={LockIcon}
                    required
                  />
                  <Field
                    type="password"
                    name="repassword"
                    value={repassword}
                    onChange={(e) => setRePassword(e.target.value)}
                    placeholder="Re-enter password"
                    icon={LockIcon}
                    required
                  />
                  <Button highlighted type="submit" marginTop="25px">
                    Sign up
                  </Button>
                </Form>
                <LineWithText>
                  <PaddedParagraph padding="0 10px" color={Grey50}>
                    or
                  </PaddedParagraph>
                </LineWithText>
              </>
            )}

            {wonderWeb3.connecting ? (
              <Button disabled className="disabled">
                <PaddedParagraph padding="0 10px">Continue on your wallet</PaddedParagraph>
              </Button>
            ) : unsuportedChain ? (
              <Button disabled>
                <Metamask height="18" width="17" />
                <PaddedParagraph padding="0 10px">Change the Network to Mainnet or Polygon</PaddedParagraph>
              </Button>
            ) : (
              <Button onClick={connectWallet}>
                <Metamask height="18" width="17" />
                <PaddedParagraph padding="0 10px">Sign up with MetaMask</PaddedParagraph>
              </Button>
            )}
          </CardBody>
          {/* <CardFooter>
            <Line size="80%" />
            <CenteredFlexRow marginTop="16px">
              Have an account?&nbsp;
              <StyledLink href="/login">Sign in.</StyledLink>
            </CenteredFlexRow>
            <CenteredFlexRow>
              Forgot &nbsp;
              <StyledLink href="/forgot-password">password</StyledLink>
              &nbsp; or &nbsp;
              <StyledLink href="/forgot-email">email</StyledLink>?
            </CenteredFlexRow>
          </CardFooter> */}
        </Card>
      </LoginWrapper>
    </AuthLayout>
  );
};

export default Signup;
