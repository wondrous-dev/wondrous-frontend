import { MissionControlButton, MissionControlIconWrapper } from 'components/Common/SidebarMainMissionControl/styles';
import SidebarTooltip from 'components/Common/SidebarMainTooltip';
import GridViewIcon from 'components/Icons/Sidebar/gridView.svg';
import Link from 'next/link';
import { Badge } from '@mui/material';
import { useHotkey } from 'utils/hooks';
import { HOTKEYS } from 'utils/hotkeyHelper';
import { useHotkeys } from 'react-hotkeys-hook';
import { useRouter } from 'next/router';

const MissionControlIconButton = ({ isActive = false }) => {
  const showBadge = useHotkey();
  const router = useRouter();
  useHotkeys(HOTKEYS.OPEN_MISSION_CONTROL, () => {
    router.push('/mission-control');
  });

  return (
    <SidebarTooltip title="Mission Control">
      <Link href="/mission-control">
        <MissionControlButton type="button" isActive={isActive}>
          <Badge
            badgeContent={HOTKEYS.OPEN_MISSION_CONTROL}
            color="primary"
            invisible={!showBadge}
            style={{ zIndex: 999 }}
          >
            <MissionControlIconWrapper>
              <GridViewIcon />
            </MissionControlIconWrapper>
          </Badge>
        </MissionControlButton>
      </Link>
    </SidebarTooltip>
  );
};

export default MissionControlIconButton;
