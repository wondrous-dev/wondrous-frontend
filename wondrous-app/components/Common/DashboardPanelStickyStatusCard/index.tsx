import { StyledBackground, Count, Status, CountStatusWrapper, StyledBorder } from './styles';

const DashboardPanelStatusCardSticky = ({ status, selectedStatus, isAdmin, setSelectedStatus }) => {
  const { count = 0, label = '', Icon, color, status: panelStatus } = status;
  const handleOnClick = () => {
    if (selectedStatus === panelStatus) {
      setSelectedStatus(null);
    } else {
      setSelectedStatus(panelStatus);
    }
  };
  return (
    <StyledBorder color={color} isActive={selectedStatus === panelStatus} isAdmin={isAdmin} onClick={handleOnClick}>
      <StyledBackground>
        <CountStatusWrapper>
          <Count color={color}>{count}</Count> <Status>{label}</Status>
        </CountStatusWrapper>
        <Icon />
      </StyledBackground>
    </StyledBorder>
  );
};

export default DashboardPanelStatusCardSticky;
