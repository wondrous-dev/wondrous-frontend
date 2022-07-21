import React, { useMemo } from 'react';
import { ProgressBarWrapper, ProgressBarValue, ProgressBarMain } from './styles';

export const ProgressBar = ({ value, total, color }) => {
  const width = useMemo(() => {
    return Math.floor((value / total) * 100);
  }, [value, total]);

  return (
    <ProgressBarWrapper>
      <ProgressBarValue width={width} color={color} />
      <ProgressBarMain />
    </ProgressBarWrapper>
  );
};
