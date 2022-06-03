import React from 'react';
import palette from 'theme/palette';
import { TaskMenuIcon } from '../../Icons/taskMenu';
import { CircleBarMetric, SimpleMetric } from './block';
import { FullMetricBlock, MetricsMenu, MetricsPanelWrapper, MetricsPannelInner } from './styles';

const MetricsPanel = (props) => {
  return (
    <MetricsPanelWrapper>
      <MetricsPannelInner>
        <SimpleMetric value={2} total={4} name={'task remaining'} color={palette.orange200} />
        <SimpleMetric value={13} total={16} name={'awaiting approval'} color={palette.purple600} />
        <SimpleMetric value={42} total={300} name={'membership requests'} color={palette.purple700} />
        <FullMetricBlock>
          <CircleBarMetric />
        </FullMetricBlock>
      </MetricsPannelInner>
      <MetricsMenu>
        <TaskMenuIcon />
      </MetricsMenu>
    </MetricsPanelWrapper>
  );
};

export default MetricsPanel;
