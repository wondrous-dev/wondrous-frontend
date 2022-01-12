import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Card, CardBody, CardFooter } from '../components/Common/auth'
import { Button } from '../components/Common/button'
import AuthLayout from '../components/Common/Layout/Auth'
import { LineWithText, Line } from '../components/Common/lines'
import { Form } from '../components/Common/form'
import { Field } from '../components/Common/field'
import { PaddedParagraph, StyledLink } from '../components/Common/text'
import {
  SmallLogo,
  LoginWrapper,
  TopBubble,
  LoginError,
} from '../components/Pages/login'
import { useState } from 'react'
import { CenteredFlexRow } from '../components/Common/index'
import { Grey50 } from '../theme/colors'
import { Metamask } from '../components/Icons/metamask'
import { EmailIcon, LockIcon } from '../components/Icons/userpass'
import { useWonderWeb3 } from '../services/web3'
import {
  emailSignin,
  getUserSigningMessage,
  walletSignin,
} from '../components/Auth/withAuth'
import { ErrorMessage } from 'formik'
import { CircularProgress } from '@material-ui/core'

const Login = ({ csrfToken }) => {
  const wonderWeb3 = useWonderWeb3()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(null)
  const router = useRouter()

  const handleSubmit = async (event) => {
    event.preventDefault()

    const result = await emailSignin(email, password)
    if (result === true) {
      router.replace('/dashboard')
    } else {
      setErrorMessage(result)
    }
  }

  const connectWallet = async (event) => {
    if (wonderWeb3.address) {
      loginWithWallet()
    } else {
      // Connect Wallet first
      await wonderWeb3.onConnect()
    }
  }

  // This happens async, so we bind it to the
  // state of the component.
  const loginWithWallet = async () => {
    if (wonderWeb3.address && wonderWeb3.chain && !wonderWeb3.connecting) {
      // Retrieve Signed Message
      const messageToSign = await getUserSigningMessage(
        wonderWeb3.address,
        wonderWeb3.chainName.toLowerCase()
      )

      if (messageToSign) {
        const signedMessage = await wonderWeb3.signMessage(messageToSign)
        if (signedMessage) {
          // Sign with Wallet
          setLoading(true)
          const result = await walletSignin(wonderWeb3.address, signedMessage)
          if (result === true) {
            router.replace('/dashboard')
          } else {
            setErrorMessage(result)
          }
          setLoading(false)
        } else {
          setErrorMessage('You need to sign the message on your Metamask')
        }
      } else {
        setErrorMessage('Login failed - try again.')
      }
    }
  }

  useEffect(() => {
    if (wonderWeb3.wallet['address']) {
      // Wallet sign in
      loginWithWallet()
    } else {
      // Error Login Here
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wonderWeb3.wallet])

  return (
    <AuthLayout>
      <LoginWrapper>
        <TopBubble src="/images/login/top-floater-bubble.png" alt="" />
        <Card>
          <CardBody>
            <SmallLogo />
            <h1>Login</h1>
            <Form onSubmit={handleSubmit}>
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
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
              <Button highlighted type="submit" marginTop="25px">
                Log me in
              </Button>
            </Form>
            <LineWithText>
              <PaddedParagraph padding="0 10px" color={Grey50}>
                or
              </PaddedParagraph>
            </LineWithText>
            {wonderWeb3.connecting ? (
              <Button disabled className="disabled">
                <PaddedParagraph padding="0 10px">
                  Log in with MetaMask
                </PaddedParagraph>
              </Button>
            ) : (
              <Button onClick={connectWallet}>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <>
                    <Metamask height="18" width="17" />
                    <PaddedParagraph padding="0 10px">
                      Log in with MetaMask
                    </PaddedParagraph>
                  </>
                )}
              </Button>
            )}
          </CardBody>
          <CardFooter>
            <Line size="80%" />
            <CenteredFlexRow marginTop="16px">
              Don&apos;t have an account yet?&nbsp;
              <StyledLink href="/signup">Sign up for the beta.</StyledLink>
            </CenteredFlexRow>
            <CenteredFlexRow>
              Forgot &nbsp;
              <StyledLink href="/forgot-password">password</StyledLink>
              &nbsp; or &nbsp;
              <StyledLink href="/forgot-email">email</StyledLink>?
            </CenteredFlexRow>
          </CardFooter>
        </Card>
      </LoginWrapper>
    </AuthLayout>
  )
}

export default Login
