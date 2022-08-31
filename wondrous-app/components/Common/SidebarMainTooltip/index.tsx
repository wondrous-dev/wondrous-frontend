import { toolTipStyle } from 'components/Common/SidebarStyles';
import Tooltip from 'components/Tooltip';

const SidebarTooltip = ({ children, ...props }) => (
  <Tooltip style={toolTipStyle} {...props} placement="right">
    <span>{children}</span>
  </Tooltip>
);

export default SidebarTooltip;
