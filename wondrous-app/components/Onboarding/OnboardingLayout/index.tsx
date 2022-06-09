import React from 'react';
import { Layout, OnboardingTitle } from './styles';

import OnboardingHeader from './Header';
import OnboardingFooter from './Footer';
import ProgressBar from 'components/Onboarding/OnboardingLayout/ProgressBar';

type Props = {
  children: any;
  headerRightContent?: React.ReactNode;
  onBackClick?: () => unknown;
  onContinueClick: () => unknown;
  onLaterClick?: () => unknown;
  step: number;
  title: string;
};

const OnboardingLayout = ({
  children,
  headerRightContent,
  onBackClick,
  onContinueClick,
  onLaterClick,
  step,
  title,
}: Props) => {
  return (
    <Layout>
      <OnboardingHeader>{headerRightContent}</OnboardingHeader>
      <ProgressBar step={step} />
      <OnboardingTitle>{title}</OnboardingTitle>

      {children}

      <OnboardingFooter onContinueClick={onContinueClick} onBackClick={onBackClick} onLaterClick={onLaterClick} />
    </Layout>
  );
};

export default OnboardingLayout;
