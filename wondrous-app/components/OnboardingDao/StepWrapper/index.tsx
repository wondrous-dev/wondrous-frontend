import { CircularProgress } from '@mui/material';
import LeftArrowIcon from 'components/Icons/leftArrow';
import { useFormikContext } from 'formik';
import { mapKeys, some } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ONBOARDING_DAO_VALUE_LOCAL_STORAGE_KEY, STEP_ACTIONS } from '../constants';
import {
  BackButton,
  ButtonWrapper,
  CloseButton,
  CloseButtonIcon,
  ComponentWrapper,
  ContinueButton,
  FooterWrapper,
  FormWrapper,
  HeaderWrapper,
  LaterButton,
  StepIndicatorDone,
  StepIndicatorEmpty,
  StepIndicatorFilled,
  StepIndicatorWrapper,
  Subtitle,
  Title,
  Wrapper,
  WrapperLoadingCircularProgress,
} from './styles';

const NO_OF_STEPS = 4;

export function OnboardingStepIndicator({ step }) {
  const rangeIndicator = (start, end, Component) =>
    Array.from({ length: start - end }, (_, i) => <Component key={i} />);
  return (
    <StepIndicatorWrapper>
      {rangeIndicator(step, 1, StepIndicatorDone)}
      <StepIndicatorFilled />
      {rangeIndicator(NO_OF_STEPS, step, StepIndicatorEmpty)}
    </StepIndicatorWrapper>
  );
}

function BackButtonWrapper({ step, handleStep }) {
  if (step === 1) return <ButtonWrapper />;
  return (
    <ButtonWrapper>
      <BackButton onClick={() => handleStep({ action: STEP_ACTIONS.prev })}>
        <LeftArrowIcon />
      </BackButton>
    </ButtonWrapper>
  );
}

function LaterButtonWrapper({ step, handleStep, hideLater }) {
  if (step === NO_OF_STEPS || hideLater) return null;
  return <LaterButton onClick={() => handleStep({ action: STEP_ACTIONS.next })}>Later</LaterButton>;
}

const useValidateStep = (fields) => {
  const { errors, setFieldTouched, validateForm } = useFormikContext();
  const touchFields = () => mapKeys(fields, (_, key) => setFieldTouched(key));
  const hasError = some(fields, (_, key) => errors[key]);
  useEffect(() => {
    validateForm();
  }, [validateForm]);
  return { touchFields, errors, hasError };
};

function ContinueButtonWrapper({ step, hoverContinue, handleStep, fields = {} }) {
  const { touchFields, hasError } = useValidateStep(fields);
  const handleOnClick = (e) => {
    e.preventDefault();
    touchFields();
    handleStep({ action: STEP_ACTIONS.next, hasError });
  };
  if (step === NO_OF_STEPS) {
    return (
      <ContinueButton hoverContinue={hoverContinue} type="submit">
        🚀 Launch DAO
      </ContinueButton>
    );
  }
  return <ContinueButton onClick={handleOnClick}>Continue</ContinueButton>;
}

function WrapperLoading({ loading, children }) {
  return (
    <Wrapper>
      {loading ? (
        <WrapperLoadingCircularProgress>
          <CircularProgress />
          <Subtitle>Loading...</Subtitle>
        </WrapperLoadingCircularProgress>
      ) : (
        children
      )}
    </Wrapper>
  );
}

function StepWrapper({
  Component,
  handleStep,
  hideLater = false,
  hoverContinue = false,
  step,
  subtitle,
  title,
  loading,
  ...props
}) {
  const router = useRouter();
  const handleOnClick = () => {
    router.push('/dashboard');
    localStorage.removeItem(ONBOARDING_DAO_VALUE_LOCAL_STORAGE_KEY);
  };
  return (
    <WrapperLoading loading={loading}>
      <FormWrapper>
        <HeaderWrapper>
          <OnboardingStepIndicator step={step} />
          <CloseButton onClick={handleOnClick}>
            <CloseButtonIcon />
          </CloseButton>
        </HeaderWrapper>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
        <ComponentWrapper>
          <Component {...props} />
        </ComponentWrapper>
        <FooterWrapper>
          <BackButtonWrapper step={step} handleStep={handleStep} />
          <ButtonWrapper>
            <LaterButtonWrapper step={step} handleStep={handleStep} hideLater={hideLater} />
            <ContinueButtonWrapper
              step={step}
              hoverContinue={hoverContinue}
              handleStep={handleStep}
              fields={props.fields}
            />
          </ButtonWrapper>
        </FooterWrapper>
      </FormWrapper>
    </WrapperLoading>
  );
}

export default StepWrapper;
