import { MissionControlButton, MissionControlIconWrapper } from 'components/Common/SidebarMainMissionControl/styles';
import SidebarTooltip from 'components/Common/SidebarMainTooltip';
import GridViewIcon from 'components/Icons/Sidebar/gridView.svg';

const MissionControlIconButton = ({ isActive = false }) => (
  <SidebarTooltip title="Mission Control">
    <MissionControlButton onClick={() => null} isActive={isActive}>
      <MissionControlIconWrapper>
        <GridViewIcon />
      </MissionControlIconWrapper>
    </MissionControlButton>
  </SidebarTooltip>
);

export default MissionControlIconButton;
