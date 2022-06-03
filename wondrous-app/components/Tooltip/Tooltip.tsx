import React from 'react';

import Divider from '@material-ui/core/Divider';
import MuiTooltip, { TooltipProps } from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

type Props = {
  children?: any;
  title?: string;
  description?: string;
  placement?: TooltipProps['placement'];
};

const Tooltip = ({ title, description, children, placement }: Props) => {
  if (!title) {
    return children;
  }

  const tooltipTitle = description ? (
    <>
      <Typography variant="body2" style={{ fontWeight: 600, fontStyle: 'italic' }}>
        {title}
      </Typography>
      <Divider />
      <Typography variant="body2" style={{ fontStyle: 'italic' }}>{description}</Typography>
    </>
  ) : (
    <Typography variant="body2" style={{ fontStyle: 'italic' }}>
      {title}
    </Typography>
  );

  return (
    <MuiTooltip arrow title={tooltipTitle} placement={placement} enterDelay={700}>
      {children}
    </MuiTooltip>
  );
};

export default Tooltip;
