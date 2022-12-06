import { memo } from 'react';
import { ProgressBarWrapper, ProgressBarInner } from './styles';

type Props = {
  isVisible: boolean;
};

const NavigationProgressMemoized = ({ isVisible }: Props) => (
  <ProgressBarWrapper key={`progress-nav-${isVisible}`}>
    <ProgressBarInner isVisible={isVisible} />
  </ProgressBarWrapper>
);

NavigationProgressMemoized.displayName = 'NavigationProgressMemo';

export default memo(NavigationProgressMemoized, (prevProps, nextProps) => prevProps.isVisible === nextProps.isVisible);
