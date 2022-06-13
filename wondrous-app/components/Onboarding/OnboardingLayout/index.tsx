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
  withLoginButton?: boolean;
  borderNone?: number | string;
  loading?: unknown;
  displayFooter?: boolean;
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
  displayFooter = true,
  withLoginButton = false,
}: Props) => {
  return (
    <Layout>
      <div>
        <OnboardingHeader withLoginButton={withLoginButton}>
          {headerRightContent}
        </OnboardingHeader>
        <ProgressBar step={step} />
        <OnboardingTitle>{title}</OnboardingTitle>
        <OnboardingDescription>{description}</OnboardingDescription>
      </div>

      {children}

      {displayFooter ? (
        <div>
          <OnboardingFooter
            onContinueClick={onContinueClick}
            onBackClick={onBackClick}
            onLaterClick={onLaterClick}
            onConnectDiscordClick={onConnectDiscordClick}
            borderNone={borderNone}
          />
        </div>
      ) : null}
    </Layout>
  );
};

export default OnboardingLayout;
