import React, { useMemo } from 'react';
import { ProgressBarWrapper, ProgressBarValue, ProgressBarMain } from './styles';

export default function ProgressBar({ value, total, color = null, height = null, progressBarProps = {} }) {
  const width = useMemo(() => Math.floor((value / total) * 100), [value, total]);
  return (
    <ProgressBarWrapper>
      <ProgressBarValue width={width} color={color} style={{ height }} {...progressBarProps} />
      <ProgressBarMain style={{ height }} />
    </ProgressBarWrapper>
  );
}
