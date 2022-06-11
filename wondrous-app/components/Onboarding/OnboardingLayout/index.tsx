import React from 'react';
import { Layout, OnboardingDescription, OnboardingTitle } from './styles';

import OnboardingHeader from './Header';
import OnboardingFooter from './Footer';
import ProgressBar from 'components/Onboarding/OnboardingLayout/ProgressBar';

type Props = {
  children?: any;
  headerRightContent?: React.ReactNode;
  onBackClick?: () => unknown;
  onConnectDiscordClick?: () => unknown;
  onContinueClick?: () => unknown;
  onLaterClick?: () => unknown;
  step: number;
  title: string;
  description?: any;
  login?: boolean;
  borderNone?: number | string;
  loading?: unknown;
};

const OnboardingLayout = ({
  borderNone,
  children,
  headerRightContent,
  onBackClick,
  onConnectDiscordClick,
  onContinueClick,
  onLaterClick,
  step,
  title,
  description,
  login,
}: Props) => {
  return (
    <Layout>
      <div>
        <OnboardingHeader borderNone ={borderNone} login={login}>{headerRightContent}</OnboardingHeader>
        <ProgressBar step={step} />
        <OnboardingTitle>{title}</OnboardingTitle>
        <OnboardingDescription>{description}</OnboardingDescription>
      </div>

      {children}

      <div>
        <OnboardingFooter
          onContinueClick={onContinueClick}
          onBackClick={onBackClick}
          onLaterClick={onLaterClick}
          onConnectDiscordClick={onConnectDiscordClick}
          borderNone={borderNone}/>
      </div>
    </Layout>
  );
};

export default OnboardingLayout;
