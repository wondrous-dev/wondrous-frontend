import styled from 'styled-components';
import { HEADER_HEIGHT } from 'utils/constants';

export const MissionControlWrapper = styled.div`
  display: flex;
  height: 100%;
  min-height: 100vh;
  margin-top: ${HEADER_HEIGHT};
`;

export const MissionControlWidgetsWrapper = styled.div`
  flex: 3;
  background: linear-gradient(180deg, #7427ff 0%, #292153 87.74%);
  mix-blend-mode: normal;
  box-shadow: 10px 4px 54px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(34px);
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
  padding: 14px;
`;

export const MissionControlSidebarWrapper = styled.div`
  flex: 1;
  background-image: url(/images/missionControl/sidebar-mission.webp);
  background-size: cover;
  padding: 14px;
`;

export const MissionControlWorkspaceCard = styled.div`
  border: 1px solid black;
  width: 49%;
  flex-grow: 1;
  height: 500px;
`;

export const MissionControlWidgetCard = styled.div`
  border: 1px solid white;
  height: 250px;
  flex: 1;
`;

export const MissionControlWidgetsContainer = styled.div`
  flex-basis: 100%;
  display: flex;
  gap: 14px;
  justify-content: center;
  align-items: center;
`;
