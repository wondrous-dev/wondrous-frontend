import AddDaoModal from 'components/Common/AddDaoModal';
import { AddIconWrapper, ButtonIcon } from 'components/Common/SidebarMainAddDao/styles';
import SidebarTooltip from 'components/Common/SidebarMainTooltip';
import AddIcon from 'components/Icons/add.svg';
import { useState } from 'react';

const AddDaoButton = ({ renderButton  = null}) => {
  const [openCreateDaoModal, setCreateDaoModal] = useState(false);
  const handleCreateDaoModal = (a) => () => setCreateDaoModal(a);
  return (
    <>
      <AddDaoModal open={openCreateDaoModal} handleClose={handleCreateDaoModal(false)} />
      {renderButton ? (
        renderButton({handleCreateDaoModal: handleCreateDaoModal(true)})
      ) : (
        <SidebarTooltip title="Create Workspace">
          <ButtonIcon onClick={handleCreateDaoModal(true)} isActive={openCreateDaoModal}>
            <AddIconWrapper isActive={openCreateDaoModal}>
              <AddIcon />
            </AddIconWrapper>
          </ButtonIcon>
        </SidebarTooltip>
      )}
    </>
  );
};

export default AddDaoButton;
