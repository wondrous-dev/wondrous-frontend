import { Button, Modal } from '@mui/material';
import { useContext } from 'react';
import { CONFIG } from 'utils/constants';
import CreateTemplateContext from 'utils/context';

const AddFormEntity = () => {
  const { addItem, toggleForm } = useContext(CreateTemplateContext);
  return (
    <Modal open onClose={toggleForm}>
      <div>
        {CONFIG.map((item, idx) => {
          return (
            <Button key={idx} type='button' onClick={() => addItem(item)}>
              {item.label}
            </Button>
          );
        })}
      </div>
    </Modal>
  );
};

export default AddFormEntity;
