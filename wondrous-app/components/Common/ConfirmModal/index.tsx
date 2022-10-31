import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';

import CloseModalIcon from 'components/Icons/closeModal';
import styles, { DeleteButton, CancelButton, SubmitButton, SubmitButtonWrap } from './styled';

export enum SubmitButtonStyle {
  Default = 'default',
  Delete = 'delete',
}

interface DocModalProps {
  open: boolean;
  title: string;
  highlightedText?: string;
  cancelLabel?: string;
  submitLabel?: string;
  submitButtonStyle?: SubmitButtonStyle | string;
  children: any;
  titleIcon?: any;
  onSubmit: () => unknown;
  onClose: () => unknown;
  rejectAction?: () => unknown;
  reverseButtons?: boolean;
}

function ConfirmModal({
  open,
  onClose,
  title,
  children,
  titleIcon,
  onSubmit,
  submitLabel = 'Submit',
  highlightedText,
  submitButtonStyle = SubmitButtonStyle.Default, // or you can pass 'delete'
  cancelLabel = 'Cancel',
  rejectAction,
  reverseButtons = false,
}: DocModalProps) {
  const cancelButtonAction = rejectAction || onClose;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: styles.backgroundPaper,
      }}
    >
      <DialogTitle sx={styles.dialogTitle}>
        {titleIcon ? <Box sx={styles.titleIcon}>{titleIcon}</Box> : null}
        {title} {highlightedText ? <Box sx={styles.highlightedText}> {highlightedText}</Box> : null}
        <Box flex={1} />
        <IconButton onClick={onClose} style={styles.closeButton}>
          <CloseModalIcon style={styles.closeButtonIcon} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box>{children}</Box>
      </DialogContent>

      <DialogActions sx={styles.dialogActions}>
        <CancelButton onClick={cancelButtonAction}>{cancelLabel}</CancelButton>

        {submitButtonStyle === SubmitButtonStyle.Default ? (
          <SubmitButtonWrap>
            <SubmitButton type="submit" onClick={onSubmit}>
              {submitLabel}
            </SubmitButton>
          </SubmitButtonWrap>
        ) : (
          <DeleteButton type="submit" onClick={onSubmit}>
            {submitLabel}
          </DeleteButton>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmModal;
