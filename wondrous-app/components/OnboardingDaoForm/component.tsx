import LeftArrowIcon from 'components/Icons/leftArrow';
import {
  BackButton,
  ButtonWrapper,
  CancelButton,
  ChildrenWrapper,
  CloseButton,
  CloseButtonIcon,
  ContinueButton,
  FormWrapper,
  HeaderWrapper,
  StepIndicatorDone,
  StepIndicatorEmpty,
  StepIndicatorFilled,
  StepIndicatorWrapper,
  Subtitle,
  Title,
  Wrapper,
  FooterWrapper,
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

const OnboardingDaoForm = ({ children, title, subtitle, step, handleLater, handleBack }) => {
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
        <ChildrenWrapper>{children}</ChildrenWrapper>
        <FooterWrapper>
          <ButtonWrapper>
            <BackButton onClick={handleBack}>
              <LeftArrowIcon />
            </BackButton>
          </ButtonWrapper>
          <ButtonWrapper>
            <CancelButton onClick={handleLater}>Later</CancelButton>
            <ContinueButton>Continue</ContinueButton>
          </ButtonWrapper>
        </FooterWrapper>
      </FormWrapper>
    </Wrapper>
  );
};

export default OnboardingDaoForm;
