import React from 'react';

import Divider from '@material-ui/core/Divider';
import MuiTooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

type Props = {
  children?: any;
  title?: string;
  description?: string;
};

const Tooltip = ({ title, description, children }: Props) => {
  if (!title) {
    return children;
  }

  const tooltipTitle = description ? (
    <>
      <Typography variant="body2" style={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Divider />
      <Typography variant="body2">{description}</Typography>
    </>
  ) : (
    title
  );

  return (
    <MuiTooltip arrow title={tooltipTitle}>
      {children}
    </MuiTooltip>
  );
};

export default Tooltip;
