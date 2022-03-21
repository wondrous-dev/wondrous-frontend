import * as React from 'react';
import { Button } from '@mui/material';
import { Tooltip as MTooltip } from '@mui/material';
import { Content, Text, Span, HLine, Bold } from './styles';
import AddIcon from '@material-ui/icons/Add';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  popper: {
    opacity: 1,
    zIndex: 999999,
  },
  tooltip: {
    backgroundColor: '#1b1b1b',
    opacity: 1,
    zIndex: 999999,
  },
  arrow: {
    color: '#1b1b1b',
    fontSize: '1.3rem',
    opacity: 1,
    zIndex: 999999,
  },
}));

export default function Tooltip({
  children = null,
  content = '',
  headText = '',
  separator = false,
  key1 = '',
  key2 = '',
  placement = 'right',
}) {
  const classes = useStyles();

  const positionRef = React.useRef({
    x: 0,
    y: 0,
  });

  const popperRef = React.useRef(null);
  const areaRef = React.useRef(null);
  return (
    <MTooltip
      classes={{ tooltip: classes.tooltip, arrow: classes.arrow, popper: classes.popper }}
      title={
        <Content>
          {headText && (
            <Text align="center">
              <Bold>{headText}</Bold> {key1 && <Span>{key1}</Span>}
              {key2 && <Span>{key2}</Span>}
            </Text>
          )}
          {separator && <HLine />}
          <Text align="center">{content}</Text>
        </Content>
      }
      placement={placement}
      arrow
    >
      <span>{children}</span>
    </MTooltip>
  );
}
