import Typography from '@mui/material/Typography';

import WonderButton from 'components/Button';
import WonderModal from 'components/Modal';

const CreateEntityDiscardTask = ({ open, onClose, onCloseFormModal, entityType }) => {
  const footerRight = (
    <>
      <WonderButton color="grey" onClick={() => onClose(false)}>
        Cancel
      </WonderButton>
      <WonderButton
        color="primary"
        onClick={() => {
          onCloseFormModal();
          onClose(false);
        }}
        buttonTheme={{
          background: '#0f0f0f',
        }}
      >
        Discard changes
      </WonderButton>
    </>
  );

  return (
    <WonderModal
      title={`Discard changes to ${entityType}?`}
      onClose={() => onClose(false)}
      footerRight={footerRight}
      maxWidth={560}
      open={open}
    >
      <Typography sx={{ color: 'white', textAlign: 'center' }}>
        Are you sure you want to discard the changes to your current {entityType}?
      </Typography>
    </WonderModal>
  );
};

export default CreateEntityDiscardTask;
