import {
  CreateFormPreviewButton,
  CreateLayoutsModalHeader,
  CreateLayoutsModalItemContainer,
  CreateLayoutsModalItemTitle,
  CreateModalOverlay,
} from 'components/CreateEntity/styles';
import { ModalBody } from './styles';

export function ErrorModal(props) {
  const { open, onClose, text, buttonText, buttonAction } = props;
  const handleOnClose = () => {
    onClose();
  };

  return (
    <CreateModalOverlay open={open} onClose={handleOnClose}>
      <ModalBody>
        <CreateLayoutsModalHeader />
        <CreateLayoutsModalItemContainer>
          <CreateLayoutsModalItemTitle>{text}</CreateLayoutsModalItemTitle>
          <CreateFormPreviewButton
            onClick={buttonAction}
            style={{
              marginTop: '24px',
            }}
          >
            {buttonText}
          </CreateFormPreviewButton>
        </CreateLayoutsModalItemContainer>
      </ModalBody>
    </CreateModalOverlay>
  );
}

// <KudosFormModal open={open} fullWidth={true} maxWidth={'sm'} onClose={handleOnClose}>
//   <KudosFormBorder>
//     <KudosFormBackground>
//       <KudosFormHeader>
//         <KudosFormHeaderText>{text}</KudosFormHeaderText>
//         <KudosFormHeaderCloseButton onClick={handleOnClose} />
//       </KudosFormHeader>
//       <KudosFormDivider />
//       <KudosFormButtonWrapper>
//         <KudosFormSubmitButton onClick={buttonAction}>
//           <KudosFormSubmitButtonText>{buttonText}</KudosFormSubmitButtonText>
//         </KudosFormSubmitButton>
//       </KudosFormButtonWrapper>
//     </KudosFormBackground>
//   </KudosFormBorder>
// </KudosFormModal>
