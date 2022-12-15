import { Badge, Typography } from '@mui/material';
import { PodsButtonWrapper, PodsIconWrapper, PodsItem } from 'components/Common/SidebarMainPods/styles';
import PodModal from 'components/Common/PodModal';
import PodsIcon from 'components/Icons/Sidebar/podsGradient.svg';
import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import typography from 'theme/typography';
import palette from 'theme/palette';
import { useHotkey } from 'utils/hooks';
import { HOTKEYS } from 'utils/hotkeyHelper';

export const PodsIconButton = ({ renderIcon = null }) => {
  const [openPodModal, setOpenPodModal] = useState(false);
  const showBadge = useHotkey();

  // TODO Adrian: refactor this to reuse the header pod modal
  return (
    <>
      {openPodModal ? <PodModal open={openPodModal} handleClose={() => setOpenPodModal(false)} /> : null}
      {renderIcon ? (
        renderIcon({ setOpenPodModal, openPodModal })
      ) : (
        <PodsItem>
          <PodsButtonWrapper onClick={() => setOpenPodModal(true)} isActive={openPodModal}>
            <Badge badgeContent={HOTKEYS.OPEN_PODS} color="primary" invisible={!showBadge} style={{ zIndex: 999 }}>
              <PodsIconWrapper>
                <PodsIcon />
              </PodsIconWrapper>
              <Typography color={palette.white} fontWeight={500} fontFamily={typography.fontFamily} fontSize="15px">
                My Pods
              </Typography>
            </Badge>
          </PodsButtonWrapper>
        </PodsItem>
      )}
    </>
  );
};

export default PodsIconButton;
