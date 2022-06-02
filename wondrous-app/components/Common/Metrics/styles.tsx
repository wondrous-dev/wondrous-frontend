import styled from 'styled-components';
import { background, blackColors, blueColors, greenColors, greyColors } from 'theme/colors';

export const MetricsPanelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;

  width: 100%;

  background: linear-gradient(267.93deg, ${greenColors.green20} 24.5%, ${greyColors.grey58} 100.14%);
  border-radius: 3px;
`;

export const MetricsPannelInner = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  flex-flow: row;
  align-items: center;
  justify-content: space-evenly;

  background: linear-gradient(180deg, ${blackColors.black95} 0%, ${blackColors.black97} 100%);
  border-radius: 3px;

  padding: 0px;

  overflow: hidden;
`;

export const FullMetricBlock = styled.div`
  display: flex;
  align-self: flex-end;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 236px;
  height: 157px;

  margin: 1px 1px 1px 0;
  margin-right: -3px;

  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;

  background: ${background};
  background: linear-gradient(45deg, ${blueColors.blue300}, ${blackColors.black100});
`;

export const MetricsBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  width: 237px;
  height: 118px;

  margin: 20px 10px;
  padding: 17px;

  background: ${background};

  border-radius: 3px;
`;

export const MetricTitle = styled.h1`
  display: flex;
  width: 100%;

  font-size: 32px;

  margin: 3px 0;
`;

export const MetricSubtitle = styled.div`
  display: flex;
  width: 100%;

  color: ${greyColors.grey250};
`;

export const MetricProgressBar = styled.div`
  display: flex;
`;

export const MetricsMenu = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
`;
