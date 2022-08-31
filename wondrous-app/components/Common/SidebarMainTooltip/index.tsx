import Tooltip from 'components/Tooltip';
import { toolTipStyle } from '../SidebarStyles';

const SidebarTooltip = ({ children, ...props }) => (
  <Tooltip style={toolTipStyle} {...props} placement="right">
    <span>{children}</span>
  </Tooltip>
);

export default SidebarTooltip;
