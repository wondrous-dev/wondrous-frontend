import { MissionControlButton, MissionControlIconWrapper } from 'components/Common/SidebarMainMissionControl/styles';
import SidebarTooltip from 'components/Common/SidebarMainTooltip';
import GridViewIcon from 'components/Icons/Sidebar/gridView.svg';
import Link from 'next/link';

const MissionControlIconButton = ({ isActive = false }) => (
  <SidebarTooltip title="Mission Control">
    <Link href="/mission-control">
      <MissionControlButton type="button" isActive={isActive}>
        <MissionControlIconWrapper>
          <GridViewIcon />
        </MissionControlIconWrapper>
      </MissionControlButton>
    </Link>
  </SidebarTooltip>
);

export default MissionControlIconButton;
