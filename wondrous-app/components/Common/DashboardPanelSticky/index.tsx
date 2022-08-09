import { StyledBorder, StyledBackground, DashboardPanelStatusCardWrapper, StyledDropShadow } from './styles';
import DashboardPanelStatusCardSticky from '../DashboardPanelStickyStatusCard';

export function DashboardPanelSticky(props) {
  const { activePanelStatusCards, selectedStatus, setSelectedStatus, isAdmin } = props;
  return (
    <StyledDropShadow>
      <StyledBorder>
        <StyledBackground>
          <DashboardPanelStatusCardWrapper>
            {activePanelStatusCards.map((status, id) => (
              <DashboardPanelStatusCardSticky
                key={status.panelPosition}
                status={status}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                isAdmin={isAdmin}
              />
            ))}
          </DashboardPanelStatusCardWrapper>
        </StyledBackground>
      </StyledBorder>
    </StyledDropShadow>
  );
}

export default DashboardPanelSticky;
