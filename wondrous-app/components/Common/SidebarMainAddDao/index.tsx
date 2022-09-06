import AddDaoModal from 'components/Common/AddDaoModal';
import { AddIconWrapper, ButtonIcon } from 'components/Common/SidebarMainAddDao/styles';
import SidebarTooltip from 'components/Common/SidebarMainTooltip';
import AddIcon from 'components/Icons/add.svg';
import { useState } from 'react';
import { Badge } from '@mui/material';
import { useHotkeys } from 'react-hotkeys-hook';
import { useHotkey } from 'utils/hooks';
import { HOTKEYS } from 'utils/hotkeyHelper';

const AddDaoButton = () => {
  const [openCreateDaoModal, setOpenCreateDaoModal] = useState(false);
  const handleCreateDaoModal = (a) => () => setOpenCreateDaoModal(a);

  const showBadge = useHotkey();

  useHotkeys(
    HOTKEYS.CREATE_DAO,
    () => {
      setOpenCreateDaoModal(!openCreateDaoModal);
    },
    [openCreateDaoModal]
  );
  return (
    <>
      <AddDaoModal open={openCreateDaoModal} handleClose={handleCreateDaoModal(false)} />
      <SidebarTooltip title="Create DAO">
        <ButtonIcon onClick={handleCreateDaoModal(true)} isActive={openCreateDaoModal}>
          <Badge badgeContent={HOTKEYS.CREATE_DAO} color="primary" invisible={!showBadge} style={{ zIndex: 999 }}>
            <AddIconWrapper isActive={openCreateDaoModal}>
              <AddIcon />
            </AddIconWrapper>
          </Badge>
        </ButtonIcon>
      </SidebarTooltip>
    </>
  );
};

export default AddDaoButton;
