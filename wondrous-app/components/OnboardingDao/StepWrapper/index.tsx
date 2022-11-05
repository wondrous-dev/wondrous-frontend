import { CircularProgress } from '@mui/material';
import LeftArrowIcon from 'components/Icons/leftArrow';
import { useFormikContext } from 'formik';
import { mapValues, some } from 'lodash';
import { useRouter } from 'next/router';
import WonderLogo from 'public/images/onboarding/wonder-logo-solid.svg';
import { STEP_ACTIONS } from '../constants';
import { MainButton } from '../styles';
import {
  BackButton,
  ButtonWrapper,
  CloseButton,
  CloseButtonIcon,
  ComponentWrapper,
  CreateDaoText,
  CreateDaoTextLogoWrapper,
  CreateDaoTextWrapperRotated,
  Ellipses1,
  Ellipses2,
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

const useValidateStep = (fields) => {
  const { errors, setFieldTouched, validateField } = useFormikContext();
  const validateFields = () => {
    Object.keys(fields).forEach((key) => {
      validateField(key);
      setFieldTouched(key);
    });
  };
  const hasError = () => some(fields, (_, key) => errors[key]);
  return { validateFields, errors, hasError };
};

const useClearFields = (props) => {
  const { tempState, setTempState, fields } = props;
  const { values, setValues } = useFormikContext() as any;
  const handleClearFields = () => {
    const clearFields = mapValues(fields, () => '');
    setTempState({ ...tempState, ...clearFields });
    setValues({ ...values, ...clearFields });
  };
  return handleClearFields;
};

export const OnboardingStepIndicator = ({ step, fieldSetsLength }) => {
  const rangeIndicator = (start, end, Component) =>
    Array.from({ length: start - end }, (_, i) => <Component key={i} />);
  return (
    <StepIndicatorWrapper>
      {rangeIndicator(step, 1, StepIndicatorDone)}
      <StepIndicatorFilled />
      {rangeIndicator(fieldSetsLength, step, StepIndicatorEmpty)}
    </StepIndicatorWrapper>
  );
};

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

const LaterButtonWrapper = ({ step, handleStep, hideLater, fieldSetsLength, handleClearFields }) => {
  const handleOnClick = () => {
    handleClearFields();
    handleStep({ action: STEP_ACTIONS.next });
  };
  if (step === fieldSetsLength || hideLater) return null;
  return <LaterButton onClick={handleOnClick}>Later</LaterButton>;
};

const ContinueButtonWrapper = ({ step, hoverContinue, handleStep, fields = {}, fieldSetsLength }) => {
  const { validateFields, hasError } = useValidateStep(fields);
  const handleOnClick = (e) => {
    e.preventDefault();
    validateFields();
    handleStep({ action: STEP_ACTIONS.next, hasError: hasError() });
  };
  if (step === fieldSetsLength) {
    return (
      <MainButton hoverContinue={hoverContinue} type="submit">
        🚀 Launch workspace
      </MainButton>
    );
  }
  return <MainButton onClick={handleOnClick}>Continue</MainButton>;
};

const CreateDaoTextWrapper = ({ left }) => {
  const createDaoElements = Array.from({ length: 14 }, () => (
    <CreateDaoTextLogoWrapper>
      <CreateDaoText>Create Workspace</CreateDaoText>
      <WonderLogo />
    </CreateDaoTextLogoWrapper>
  ));
  return <CreateDaoTextWrapperRotated left={left}>{createDaoElements}</CreateDaoTextWrapperRotated>;
};

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
      <Ellipses1 />
      <Ellipses2 />
      <CreateDaoTextWrapper left />
      <CreateDaoTextWrapper left={false} />
    </Wrapper>
  );
}

function StepWrapper({
  Component,
  fieldSetsLength,
  handleStep,
  hideLater = false,
  hoverContinue = false,
  loading,
  step,
  subtitle,
  title,
  ...props
}) {
  const router = useRouter();
  const handleOnClick = () => router.back();
  const handleClearFields = useClearFields(props);
  return (
    <WrapperLoading loading={loading}>
      <FormWrapper>
        <HeaderWrapper>
          <OnboardingStepIndicator step={step} fieldSetsLength={fieldSetsLength} />
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
            <LaterButtonWrapper
              step={step}
              handleStep={handleStep}
              hideLater={hideLater}
              fieldSetsLength={fieldSetsLength}
              handleClearFields={handleClearFields}
            />
            <ContinueButtonWrapper
              step={step}
              hoverContinue={hoverContinue}
              handleStep={handleStep}
              fields={props.fields}
              fieldSetsLength={fieldSetsLength}
            />
          </ButtonWrapper>
        </FooterWrapper>
      </FormWrapper>
    </WrapperLoading>
  );
}

export default StepWrapper;
