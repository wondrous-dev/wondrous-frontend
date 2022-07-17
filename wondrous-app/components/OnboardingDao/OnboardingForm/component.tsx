import LeftArrowIcon from 'components/Icons/leftArrow';
import {
  BackButton,
  ButtonWrapper,
  CancelButton,
  CloseButton,
  CloseButtonIcon,
  ComponentWrapper,
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

const NO_OF_STEPS = 6;

export const OnboardingStepIndicator = ({ step }) => {
  const rangeIndicator = (start, end, Component) =>
    Array.from({ length: start - end }, (_, i) => <Component key={i} />);
  return (
    <StepIndicatorWrapper>
      {rangeIndicator(step, 1, StepIndicatorDone)}
      <StepIndicatorFilled />
      {rangeIndicator(NO_OF_STEPS, step, StepIndicatorEmpty)}
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

const LaterButtonWrapper = ({ step, handleLater }) => {
  if (step === NO_OF_STEPS) return null;
  return <CancelButton onClick={handleLater}>Later</CancelButton>;
};

const ContinueButtonWrapper = ({ step }) => {
  if (step === NO_OF_STEPS) return <ContinueButton>🚀 Launch DAO</ContinueButton>;
  return <ContinueButton>Next</ContinueButton>;
};

const StepWrapper = ({ Component, title, subtitle, step, handleLater, handleBack }) => {
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
            <LaterButtonWrapper step={step} handleLater={handleLater} />
            <ContinueButtonWrapper step={step} />
          </ButtonWrapper>
        </FooterWrapper>
      </FormWrapper>
    </Wrapper>
  );
};

export default StepWrapper;
