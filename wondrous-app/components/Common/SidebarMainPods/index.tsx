import { Badge } from '@mui/material';
import { PodModal } from 'components/Common/PodModal';
import { PodsButton, PodsIconWrapper } from 'components/Common/SidebarMainPods/styles';
import SidebarTooltip from 'components/Common/SidebarMainTooltip';
import { PageItemContainer } from 'components/HeaderItems/UserProfile/styles';
import PodsIcon from 'components/Icons/Sidebar/podsGradient.svg';
import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useHotkey } from 'utils/hooks';
import { HOTKEYS } from 'utils/hotkeyHelper';

const PodsIconButton = () => {
  const [openPodModal, setOpenPodModal] = useState(false);
  const showBadge = useHotkey();

  useHotkeys(
    HOTKEYS.OPEN_PODS,
    () => {
      setOpenPodModal(!openPodModal);
    },
    [openPodModal]
  );

  return (
    <>
      <PodModal open={openPodModal} handleClose={() => setOpenPodModal(false)} />
      <PageItemContainer>
      <PodsButton onClick={() => setOpenPodModal(true)} isActive={openPodModal}>
        <Badge badgeContent={HOTKEYS.OPEN_PODS} color="primary" invisible={!showBadge} style={{ zIndex: 999 }}>
          <PodsIcon />
        </Badge>
      </PodsButton>
      </PageItemContainer>
    </>
  );
};

export default PodsIconButton;
