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
    zIndex: 201,
  },
  tooltip: {
    backgroundColor: '#1b1b1b!important',
    opacity: 1,
    zIndex: 201,
  },
  arrow: {
    color: '#1b1b1b!important',
    fontSize: '1.3rem',
    opacity: 1,
    zIndex: 201,
  },
}));

export default function Tooltip(props) {
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
          {props.headText && (
            <Text align="center">
              <Bold>{props.headText}</Bold> {props.key1 && <Span>{props.key1}</Span>}
              {props.key2 && <Span>{props.key2}</Span>}
            </Text>
          )}
          {props.separator && <HLine />}
          <Text align="center">{props.content}</Text>
        </Content>
      }
      placement={props.placement}
      arrow
    >
      <span>{props.children}</span>
    </MTooltip>
  );
}
