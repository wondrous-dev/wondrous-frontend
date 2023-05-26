import { Typography } from "@mui/material";
import Modal from "components/Shared/Modal";
import { SharedSecondaryButton } from "components/Shared/styles";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  onCancel: () => void;
  onConfirm: () => void;
  body: string;
  cancelButtonTitle?: string;
  confirmButtonTitle?: string;
}

const ConfirmActionModal = ({
  isOpen,
  onClose,
  title = "Confirm",
  onCancel,
  onConfirm,
  body,
  cancelButtonTitle = "Cancel",
  confirmButtonTitle = "Confirm",
}: IProps) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
      }}
    >
      <Modal
        open={isOpen}
        onClose={onClose}
        title={title}
        maxWidth={600}
        footerLeft={
          <SharedSecondaryButton $reverse onClick={onCancel}>
            {cancelButtonTitle}
          </SharedSecondaryButton>
        }
        footerRight={<SharedSecondaryButton onClick={onConfirm}>{confirmButtonTitle}</SharedSecondaryButton>}
      >
        <Typography fontFamily="Poppins" fontWeight={500} fontSize="14px" lineHeight="24px" color="black">
          {body}
        </Typography>
      </Modal>
    </div>
  );
};

export default ConfirmActionModal;
