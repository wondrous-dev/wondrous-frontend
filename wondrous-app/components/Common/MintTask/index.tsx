import { useState } from 'react';
import MintTaskButton from './MintTaskButton';
import Modals from './Modals';

const MintTaskComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen((prevState) => !prevState);
  return (
    <>
      <Modals isOpen={isModalOpen} onClose={toggleModal} />
      <MintTaskButton onClick={toggleModal} />
    </>
  );
};

export default MintTaskComponent;
