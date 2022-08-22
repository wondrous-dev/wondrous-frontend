import styled from 'styled-components';
import { HEADER_HEIGHT } from 'utils/constants';

export const MissionControlWrapper = styled.div`
  display: flex;
  height: 100%;
  min-height: 100vh;
  margin-top: ${HEADER_HEIGHT};
`;

export const MissionControlWidgetsWrapper = styled.div`
  flex: 2.8;
  background: linear-gradient(180deg, #7427ff 12.22%, #292153 100%);
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
  background-image: url(/images/mission-control/sidebar-mission.webp);
  background-size: cover;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const MissionControlWorkspaceCard = styled.div`
  border: 1px solid black;
  width: 49%;
  flex-grow: 1;
`;

export const MissionControlWidgetsContainer = styled.div`
  flex-basis: 100%;
  display: flex;
  gap: 14px;
  justify-content: flex-start;
  align-items: baseline;
`;
