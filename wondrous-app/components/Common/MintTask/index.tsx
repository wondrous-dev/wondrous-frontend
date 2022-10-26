import { useState } from 'react';
import MintTaskButton from './MintTaskButton';
import Modals from './Modals';
import OpenseaButton from './OpenseaButton';

const MintTaskComponent = ({ tokenId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (tokenId) {
    return <OpenseaButton tokenId={tokenId} />;
  }
  const toggleModal = () => setIsModalOpen((prevState) => !prevState);
  return (
    <>
      <Modals isOpen={isModalOpen} onClose={toggleModal} />
      <MintTaskButton onClick={toggleModal} />
    </>
  );
};

export default MintTaskComponent;
