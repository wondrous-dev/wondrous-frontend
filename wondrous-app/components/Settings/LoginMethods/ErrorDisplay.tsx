import { ErrorContainer } from './styles';

const ErrorDisplay = ({ method }) => (
  <ErrorContainer>
    <p>Cannot remove {method}. You need at least one login method. Please add another.</p>
  </ErrorContainer>
);

export default ErrorDisplay;
