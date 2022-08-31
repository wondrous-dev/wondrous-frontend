import { PodModal } from 'components/Common/SidebarMainPods/PodModal';
import { PodsButton, PodsIconWrapper } from 'components/Common/SidebarMainPods/styles';
import SidebarTooltip from 'components/Common/SidebarMainTooltip';
import PodsIcon from 'components/Icons/Sidebar/podsGradient.svg';
import { useState } from 'react';

const PodsIconButton = () => {
  const [openPodModal, setOpenPodModal] = useState(false);
  return (
    <>
      <PodModal open={openPodModal} handleClose={() => setOpenPodModal(false)} />
      <SidebarTooltip title="Pods">
        <PodsButton onClick={() => setOpenPodModal(true)} isActive={openPodModal}>
          <PodsIconWrapper>
            <PodsIcon />
          </PodsIconWrapper>
        </PodsButton>
      </SidebarTooltip>
    </>
  );
};

export default PodsIconButton;
