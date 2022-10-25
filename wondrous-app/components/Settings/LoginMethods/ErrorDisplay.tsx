import { WarningIcon } from 'components/Icons/WarningIcon';
import { ErrorContainer } from './styles';

const ErrorDisplay = ({ method }) => {
  return (
    <ErrorContainer>
      <WarningIcon />
      <p>Cannot remove {method}. You need at least one login method. Please add another.</p>
    </ErrorContainer>
  );
};

export default ErrorDisplay;
