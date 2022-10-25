import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useWonderWeb3 } from 'services/web3';
import SettingsWrapper from 'components/Common/SidebarSettings';
import {
  ButtonContainer,
  CancelSpan,
  ChangePasswordButton,
  ConnectToDiscordButton,
  ConnectToWalletButton,
  ContentContainer,
  ErrorContainer,
  IndicatorContainer,
  InputFlexSection,
  InputSection,
  LogInMethodContainer,
  LogInMethodForm,
  LoginTitleContainer,
  ReplaceWalletButton,
  ResetButton,
  SaveChangesButton,
  SectionContainer,
  StatusContainer,
} from './styles';
import { HeaderBlock } from '../headerBlock';
import { DiscordIcon } from 'components/Icons/discord';
import LoadIcon from 'components/Icons/LoadIcon';
import IndicateIcon from 'components/Icons/IndicateIcon';
import { WarningIcon } from 'components/Icons/WarningIcon';

const SUPPORTED_PAYMENT_CHAINS = [
  {
    label: 'Ethereum Mainnet',
    value: 'ethereum',
  },
  {
    label: 'Polygon Mainnet',
    value: 'polygon',
  },
  {
    label: 'Harmony Mainnet',
    value: 'harmony',
  },
  {
    label: 'Boba Mainnet',
    value: 'boba',
  },
  {
    label: 'Arbitrum Mainnet',
    value: 'arbitrum',
  },
];
if (!process.env.NEXT_PUBLIC_PRODUCTION) {
  SUPPORTED_PAYMENT_CHAINS.push({
    label: 'Ethereum Rinkeby',
    value: 'rinkeby',
  });
}

function LogInMethods(props) {
  const router = useRouter();
  const wonderWeb3 = useWonderWeb3();

  const { orgId } = router.query as { orgId: string; podId: string };
  console.log(orgId, 'orgid, podid');
  useEffect(() => {
    if (wonderWeb3?.onConnect) {
      wonderWeb3.onConnect();
    }
  }, []);

  const [formData, setFormData] = useState<{ email: string; password: string }>({
    email: '',
    password: '',
  });

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <SettingsWrapper>
      <LogInMethodContainer>
        <HeaderBlock
          title="Log in methods"
          description="Add/edit your log in methods. You can choose as many you require."
        />
        <SectionContainer>
          <IndicatorContainer>
            <IndicateIcon />
            <p>You currently have only one active log in method. Please add one alternative before removing.</p>
          </IndicatorContainer>
        </SectionContainer>
        <ContentContainer>
          <SectionContainer>
            <LoginTitleContainer>
              <p>Log in through password and username</p>
              <StatusContainer status={'active'}>Active</StatusContainer>
            </LoginTitleContainer>
            <LogInMethodForm
              onSubmit={(e) => {
                onSubmit(e);
              }}
            >
              <InputSection>
                <label htmlFor="email">Email</label>
                <input
                  onChange={(e) => handleInputs(e)}
                  type="email"
                  name="email"
                  placeholder="eth.reverise@gmail.com"
                />
              </InputSection>
              <InputFlexSection>
                <InputSection>
                  <label htmlFor="password">Password</label>
                  <input onChange={(e) => handleInputs(e)} name="password" type="password" />
                </InputSection>
                <ChangePasswordButton highlighted={true}>Change Password</ChangePasswordButton>
              </InputFlexSection>
            </LogInMethodForm>
          </SectionContainer>
          <SectionContainer>
            <LoginTitleContainer>
              <p>Log in through Discord</p>
            </LoginTitleContainer>
            <ButtonContainer>
              <ConnectToDiscordButton>
                <DiscordIcon />
                Connect to Discord
                {true && <CancelSpan>x</CancelSpan>}
              </ConnectToDiscordButton>
              <StatusContainer status={'inactive'}>Inactive</StatusContainer>
            </ButtonContainer>
            <ErrorContainer>
              <WarningIcon />
              <p>Cannot remove Discord. You need at least one login method. Please add another.</p>
            </ErrorContainer>
          </SectionContainer>
          <SectionContainer>
            <LoginTitleContainer>
              <p>Log in through your wallet</p>
            </LoginTitleContainer>
            <ButtonContainer>
              <ConnectToWalletButton highlighted={true}>
                Connect to Wallet {true && <CancelSpan>x</CancelSpan>}
              </ConnectToWalletButton>
              <ReplaceWalletButton>
                <LoadIcon /> Replace wallet address
              </ReplaceWalletButton>
              <StatusContainer status={'active'}>Active</StatusContainer>
            </ButtonContainer>
          </SectionContainer>

          <ButtonContainer>
            <ResetButton>Reset changes</ResetButton>
            <SaveChangesButton highlighted>Save changes </SaveChangesButton>
          </ButtonContainer>
        </ContentContainer>
      </LogInMethodContainer>
    </SettingsWrapper>
  );
}

export default LogInMethods;
