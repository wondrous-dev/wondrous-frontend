import React from 'react';
import { Logo } from '../../Icons/logo';
import { ProgressBar } from '../ProgressBar';

import { MetricsBlock, MetricSubtitle, MetricTitle } from './styles';

export function CircleBarMetric(prop) {
  return <Logo />;
}

export function SimpleMetric({ value, total, name, color }) {
  return (
    <MetricsBlock key={`simple-metric-${name}`}>
      <MetricTitle>{value}</MetricTitle>
      <MetricSubtitle>{name}</MetricSubtitle>
      <ProgressBar value={value} total={total} color={color} />
    </MetricsBlock>
  );
}
