import Image from 'next/legacy/image';
import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';

import styles, { cancelStyles, submitStyles, deleteStyles } from './DocModalStyles';

const CancelButton = styled(Button)(cancelStyles);
const SubmitButton = styled(Button)(submitStyles);
const DeleteButton = styled(Button)(deleteStyles);

interface DocModalProps {
  open: boolean;
  onClose: any;
  title: string;
  highlightedText?: string;
  submitLabel?: string;
  deleteLabel?: string;
  cancelLabel?: string;
  children: any;
  titleIcon?: any;
  onDelete?: any;
  onSubmit?: any;
}

function DocModal({
  open,
  onClose,
  title,
  highlightedText,
  children,
  titleIcon,
  onDelete,
  onSubmit,
  submitLabel,
  deleteLabel,
  cancelLabel,
}: DocModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: styles.backgroundPaper,
      }}
      sx={styles.white}
    >
      <DialogTitle sx={styles.dialogTitle}>
        <Box sx={styles.titleIcon}>{titleIcon}</Box>
        {title} <Box sx={styles.highlightedText}> {highlightedText}</Box>
        <Box flex={1} />
        <Box onClick={onClose} sx={styles.closeButton}>
          <Image src="/images/icons/close.svg" alt="close icon" width={8} height={8} />
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 8 }}>
        <Box mt={3}>{children}</Box>
      </DialogContent>

      <DialogActions sx={styles.dialogActions}>
        {onDelete && onSubmit && (
          <>
            <DeleteButton onClick={onDelete}>
              <Box>{deleteLabel || 'Delete'}</Box>
            </DeleteButton>
            <Box flex={1} />
          </>
        )}

        <CancelButton onClick={onClose}>{cancelLabel || 'Cancel'}</CancelButton>

        {onSubmit && (
          <SubmitButton type="submit" onClick={onSubmit}>
            <Box>{submitLabel || 'Submit'}</Box>
          </SubmitButton>
        )}

        {onDelete && !onSubmit && (
          <DeleteButton onClick={onDelete}>
            <Box>{deleteLabel || 'Delete'}</Box>
          </DeleteButton>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default DocModal;
