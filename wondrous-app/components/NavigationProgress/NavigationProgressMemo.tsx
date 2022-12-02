import { memo } from 'react';
import { ProgressBarWrapper, ProgressBarInner } from './styles';

type Props = {
  isVisible: boolean;
};

const NavigationProgressMemo = ({ isVisible }: Props) => (
  <ProgressBarWrapper key={`progress-nav-${isVisible}`}>
    <ProgressBarInner isVisible={isVisible} />
  </ProgressBarWrapper>
);

NavigationProgressMemo.displayName = 'NavigationProgressMemo';

export default memo(NavigationProgressMemo, (prevProps, nextProps) => prevProps.isVisible === nextProps.isVisible);
