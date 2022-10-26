import VARIATIONS from './constants';
import { IconWrapper, StatusWrapper } from './styles';

const Status = (props) => {
  const { Icon, Text, textContent, variation } = props || {};
  return (
    <StatusWrapper variation={variation}>
      {variation === VARIATIONS.rounded && (
        <IconWrapper>
          <Icon />
        </IconWrapper>
      )}
      <Text>{textContent}</Text>
    </StatusWrapper>
  );
};

export default Status;
