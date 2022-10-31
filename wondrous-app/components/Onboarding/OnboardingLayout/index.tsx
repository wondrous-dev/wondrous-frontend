import React, {ReactFragment} from 'react';
import ProgressBar from 'components/Onboarding/OnboardingLayout/ProgressBar';
import { Layout, OnboardingDescription, OnboardingTitle } from './styles';

import OnboardingHeader from './Header';
import OnboardingFooter from './Footer';

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
  loading?: unknown;
  displayFooter?: boolean;
  footer?: React.ReactNode | React.FC | null;
};

function OnboardingLayout({
  children,
  headerRightContent,
  onBackClick,
  onConnectDiscordClick,
  onContinueClick,
  onLaterClick,
  step,
  title,
  description,
  footer,
  withLoginButton = false,
}: Props) {
  return (
    <Layout>
      <div>
        <OnboardingHeader withLoginButton={withLoginButton}>{headerRightContent}</OnboardingHeader>
        <ProgressBar step={step} />
        <OnboardingTitle>{title}</OnboardingTitle>
        <OnboardingDescription>{description}</OnboardingDescription>
      </div>

      {children}

      {footer || (
        <div>
          <OnboardingFooter
            onContinueClick={onContinueClick}
            onBackClick={onBackClick}
            onLaterClick={onLaterClick}
            onConnectDiscordClick={onConnectDiscordClick}
          />
        </div>
      )}
    </Layout>
  );
}

export default OnboardingLayout;
