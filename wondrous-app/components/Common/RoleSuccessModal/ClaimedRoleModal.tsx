import {
  RequestModalBox,
  RequestModalCloseIcon,
  RequestModalContainer,
  RequestModalRolesSubtitle,
  RequestModalRolesSuccessIcon,
  RequestModalShowRole,
  RequestModalSubtitle,
  RequestModalSuccessContainer,
  RequestModalTitle,
  RequestModalTitleBar,
  RequestModalTypeText,
} from 'components/organization/wrapper/styles';
import { StyledWarningMessage } from '../ArchiveTaskModal/styles';

const SuccessRoleModal = (props) => {
  const { open, onClose, notLinkedWalletError, linkedWallet, role, request } = props;

  return (
    <RequestModalContainer
      open={open}
      onClose={onClose}
      aria-labelledby="archive-task-modal"
      aria-describedby="modal-modal-description"
    >
      <RequestModalBox
        style={{
          width: '600px',
          height: 'auto',
        }}
      >
        {notLinkedWalletError && (
          <StyledWarningMessage
            style={{
              marginLeft: 0,
            }}
          >
            {`To join via token gated role, switch to linked wallet ${linkedWallet?.slice(0, 7)}...`}
          </StyledWarningMessage>
        )}
        <RequestModalTitleBar>
          <RequestModalTitle>Success!</RequestModalTitle>

          <RequestModalCloseIcon
            color="#FFFFFF"
            onClick={() => {
              onClose();
            }}
          />
        </RequestModalTitleBar>
        <RequestModalSuccessContainer>
          <RequestModalRolesSuccessIcon />
          <RequestModalSubtitle style={{ marginTop: '18px' }}>You have claimed a new role!</RequestModalSubtitle>
        </RequestModalSuccessContainer>
        <RequestModalShowRole>
          {request ? <RequestModalRolesSubtitle>{`Request: ${request}`}</RequestModalRolesSubtitle> : null}
          <RequestModalTypeText>{`🔮 ${role?.name}`}</RequestModalTypeText>
        </RequestModalShowRole>
      </RequestModalBox>
    </RequestModalContainer>
  );
};

export default SuccessRoleModal;
