import styled from 'styled-components';
import palette from 'theme/palette';

export const MetricsPanelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;

  width: 100%;

  background: linear-gradient(267.93deg, ${palette.green20} 24.5%, ${palette.grey58} 100.14%);
  border-radius: 3px;
`;

export const MetricsPannelInner = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  flex-flow: row;
  align-items: center;
  justify-content: space-evenly;

  background: linear-gradient(180deg, ${palette.black95} 0%, ${palette.black97} 100%);
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

  background: ${palette.background.default};
  background: linear-gradient(45deg, ${palette.blue300}, ${palette.black100});
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

  background: ${palette.background.default};

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

  color: ${palette.grey250};
`;

export const MetricProgressBar = styled.div`
  display: flex;
`;

export const MetricsMenu = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
`;
