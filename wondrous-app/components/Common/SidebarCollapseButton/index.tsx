import { Button, Wrapper } from 'components/Common/SidebarCollapseButton/styles';
import BackArrowIcon from 'components/Icons/backArrow';
import Tooltip from 'components/Tooltip';
import { useSideBar } from 'utils/hooks';
import { toolTipStyle } from 'components/Common/SidebarStyles';

const CollapseExpandButton = () => {
  const { setMinimized, minimized } = useSideBar();

  const title = minimized ? 'Expand' : 'Collapse';
  return (
    <Wrapper minimized={minimized}>
      <Tooltip style={toolTipStyle} title={`${title} Sidebar`} placement="right">
        <Button minimized={minimized} onClick={() => setMinimized((prev) => !prev)}>
          <BackArrowIcon />
        </Button>
      </Tooltip>
    </Wrapper>
  );
};

export default CollapseExpandButton;
