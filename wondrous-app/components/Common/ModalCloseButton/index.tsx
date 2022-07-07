import { StyledCloseButton } from './styles';
import CloseModalIcon from '../../Icons/closeModal';

export const ModalCloseButton = (props) => {
  const { onClick, circle } = props;

  return (
    <StyledCloseButton circle={circle} onClick={onClick}>
      <CloseModalIcon />
    </StyledCloseButton>
  );
};
