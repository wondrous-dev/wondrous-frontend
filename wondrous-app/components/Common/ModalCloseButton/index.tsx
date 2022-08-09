import CloseModalIcon from 'components/Icons/closeModal';
import { StyledCloseButton } from './styles';

export function ModalCloseButton(props) {
  const { onClick, circle } = props;

  return (
    <StyledCloseButton circle={circle} onClick={onClick}>
      <CloseModalIcon />
    </StyledCloseButton>
  );
}
