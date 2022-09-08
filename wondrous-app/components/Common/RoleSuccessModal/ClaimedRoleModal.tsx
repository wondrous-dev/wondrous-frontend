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
} from 'components/organization/wrapper/styles';
import { StyledWarningMessage } from 'components/Common/ArchiveTaskModal/styles';
import RolePill from 'components/Common/RolePill';

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
          <RequestModalSubtitle style={{ marginTop: '18px' }}>{`You have ${
            request ? 'requested' : 'claimed'
          } a new role!`}</RequestModalSubtitle>
        </RequestModalSuccessContainer>
        <RequestModalShowRole>
          {request ? <RequestModalRolesSubtitle>{`Request: ${request}`}</RequestModalRolesSubtitle> : null}
          <RolePill roleName={role?.name} />
        </RequestModalShowRole>
      </RequestModalBox>
    </RequestModalContainer>
  );
};

export default SuccessRoleModal;
