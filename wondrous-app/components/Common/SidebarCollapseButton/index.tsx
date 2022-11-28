import { FC } from 'react';
import { Button, Wrapper } from 'components/Common/SidebarCollapseButton/styles';
import BackArrowIcon from 'components/Icons/backArrow';
import Tooltip from 'components/Tooltip';
import { useSideBar } from 'utils/hooks';
import { toolTipStyle } from 'components/Common/SidebarStyles';

interface Props {
  onClick?: () => void;
}

const CollapseExpandButton: FC<Props> = ({ onClick }) => {
  const { setMinimized } = useSideBar();
  return (
    <Wrapper>
      <Tooltip style={toolTipStyle} title="Collapse Sidebar" placement="right">
        <Button
          onClick={() => {
            setMinimized(true);
            onClick?.();
          }}
        >
          <BackArrowIcon />
        </Button>
      </Tooltip>
    </Wrapper>
  );
};

export default CollapseExpandButton;
