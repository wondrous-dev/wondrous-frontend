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
} from 'components/RoleModal/styles';
import RolePill from 'components/Common/RolePill';

const SuccessRoleModal = (props) => {
  const { open, onClose, role, joinRequestSent } = props;

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
            joinRequestSent ? 'requested' : 'claimed'
          } a new role!`}</RequestModalSubtitle>
        </RequestModalSuccessContainer>
        <RequestModalShowRole>
          <RolePill roleName={role?.name} />
        </RequestModalShowRole>
      </RequestModalBox>
    </RequestModalContainer>
  );
};

export default SuccessRoleModal;
