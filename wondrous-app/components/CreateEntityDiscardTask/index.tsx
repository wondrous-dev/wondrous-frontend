import CloseModalIcon from 'components/Icons/closeModal';
import { Body, Cancel, CloseHeaderIcon, Discard, Footer, Header, HeaderText, StyledModal, Wrapper } from './styles';

const CreateEntityDiscardTask = ({ open, onClose, onCloseFormModal, entityType }) => (
  <StyledModal open={open} onClose={() => onClose(false)}>
    <Wrapper>
      <Header>
        <HeaderText>Discard {entityType} data?</HeaderText>
        <CloseHeaderIcon onClick={() => onClose(false)}>
          <CloseModalIcon />
        </CloseHeaderIcon>
      </Header>
      <Body>
        <p>Are you sure you want to discard your current {entityType}?</p>
      </Body>
      <Footer>
        <Cancel onClick={() => onClose(false)}>Cancel</Cancel>
        <Discard
          onClick={() => {
            onCloseFormModal();
            onClose(false);
          }}
        >
          Discard {entityType}
        </Discard>
      </Footer>
    </Wrapper>
  </StyledModal>
);

export default CreateEntityDiscardTask;
