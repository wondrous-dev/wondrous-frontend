import {
  TaskApplicationFormModal,
  TaskApplicationFormBorder,
  TaskApplicationFormBackground,
  TaskApplicationFormHeader,
  TaskApplicationFormHeaderText,
  TaskApplicationFormHeaderCloseButton,
} from './TaskApplicationFormModal/styles';
import { ConfirmationModalBody, ConfirmationModalFooter } from './styles';
import { RejectButton } from './ApplicationList/styles';
import { ActionButton } from 'components/Common/Task/styles';

interface Props {
  onClose: () => void;
  headerText: string;
  bodyText: string;
  confirmationButtonText: string;
  onConfirm: () => void;
}

export default function ConfirmationModal({
  onClose = () => {},
  headerText = '',
  bodyText = '',
  confirmationButtonText = '',
  onConfirm = () => {},
}) {
  return (
    <TaskApplicationFormModal open>
      <TaskApplicationFormBorder>
        <TaskApplicationFormBackground>
          <TaskApplicationFormHeader style={{ borderBottom: '0px' }}>
            <TaskApplicationFormHeaderText>{headerText}</TaskApplicationFormHeaderText>
            <TaskApplicationFormHeaderCloseButton onClick={onClose} />
          </TaskApplicationFormHeader>
          <ConfirmationModalBody>{bodyText}</ConfirmationModalBody>
          <ConfirmationModalFooter>
            <RejectButton type="button" onClick={onClose}>
              Cancel
            </RejectButton>
            <ActionButton type="button" onClick={onConfirm}>
              {confirmationButtonText}
            </ActionButton>
          </ConfirmationModalFooter>
        </TaskApplicationFormBackground>
      </TaskApplicationFormBorder>
    </TaskApplicationFormModal>
  );
}
