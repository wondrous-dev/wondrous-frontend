import LeftArrowIcon from 'components/Icons/leftArrow';
import {
  BackButton,
  ButtonWrapper,
  CancelButton,
  ComponentWrapper,
  CloseButton,
  CloseButtonIcon,
  ContinueButton,
  FooterWrapper,
  FormWrapper,
  HeaderWrapper,
  StepIndicatorDone,
  StepIndicatorEmpty,
  StepIndicatorFilled,
  StepIndicatorWrapper,
  Subtitle,
  Title,
  Wrapper,
} from './styles';

export const OnboardingStepIndicator = ({ step }) => {
  const noOfSteps = 6;
  const rangeIndicator = (start, end, Component) =>
    Array.from({ length: start - end }, (_, i) => <Component key={i} />);
  return (
    <StepIndicatorWrapper>
      {rangeIndicator(step, 1, StepIndicatorDone)}
      <StepIndicatorFilled />
      {rangeIndicator(noOfSteps, step, StepIndicatorEmpty)}
    </StepIndicatorWrapper>
  );
};

const BackButtonWrapper = ({ step, handleBack }) => {
  if (step === 1) return <ButtonWrapper />;
  return (
    <ButtonWrapper>
      <BackButton onClick={handleBack}>
        <LeftArrowIcon />
      </BackButton>
    </ButtonWrapper>
  );
};

const CancelButtonWrapper = ({ step, handleLater }) => {
  if (step === 6) return null;
  return <CancelButton onClick={handleLater}>Later</CancelButton>;
};

const ContinueButtonWrapper = ({ step }) => {
  if (step === 6) return <ContinueButton>🚀 Launch DAO</ContinueButton>;
  return <ContinueButton>Next</ContinueButton>;
};

const OnboardingDaoForm = ({ Component, title, subtitle, step, handleLater, handleBack }) => {
  return (
    <Wrapper>
      <FormWrapper>
        <HeaderWrapper>
          <OnboardingStepIndicator step={step} />
          <CloseButton>
            <CloseButtonIcon />
          </CloseButton>
        </HeaderWrapper>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
        <ComponentWrapper>
          <Component />
        </ComponentWrapper>
        <FooterWrapper>
          <BackButtonWrapper step={step} handleBack={handleBack} />
          <ButtonWrapper>
            <CancelButtonWrapper step={step} handleLater={handleLater} />
            <ContinueButtonWrapper step={step} />
          </ButtonWrapper>
        </FooterWrapper>
      </FormWrapper>
    </Wrapper>
  );
};

export default OnboardingDaoForm;
