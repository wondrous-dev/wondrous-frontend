import { useQuery } from '@apollo/client';
import { Badge } from '@mui/material';
import { useMe } from 'components/Auth/withAuth';
import PodModal from 'components/Common/PodModal';
import { PodsButton, PodsIconWrapper } from 'components/Common/SidebarMainPods/styles';
import SidebarTooltip from 'components/Common/SidebarMainTooltip';
import PodsIcon from 'components/Icons/Sidebar/podsGradient.svg';
import { GET_USER_PODS_WITH_COUNT } from 'graphql/queries';
import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useHotkey } from 'utils/hooks';
import { HOTKEYS } from 'utils/hotkeyHelper';

export const useGetUserPods = () => {
  const { id: userId } = useMe() || {};
  const { data } = useQuery(GET_USER_PODS_WITH_COUNT, {
    skip: !userId,
    variables: {
      userId,
    },
  });
  const { getUserPods: pods } = data || {};
  return pods;
};

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
      <PodModal open={openPodModal} handleClose={() => setOpenPodModal(false)} pods={useGetUserPods()} />
      <SidebarTooltip title="Pods" style={{ zIndex: 2 }}>
        <PodsButton onClick={() => setOpenPodModal(true)} isActive={openPodModal}>
          <Badge badgeContent={HOTKEYS.OPEN_PODS} color="primary" invisible={!showBadge} style={{ zIndex: 999 }}>
            <PodsIconWrapper>
              <PodsIcon />
            </PodsIconWrapper>
          </Badge>
        </PodsButton>
      </SidebarTooltip>
    </>
  );
};

export default PodsIconButton;
