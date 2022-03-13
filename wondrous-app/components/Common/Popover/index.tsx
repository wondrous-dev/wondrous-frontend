import * as React from 'react';
import {Button} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { Content, Text, Span, HLine, Bold } from './styles';
import AddIcon from '@material-ui/icons/Add';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  arrow: {
    fontSize: '1.3rem'
  }
}));

export default function AnchorElTooltips({ content = '', headText = '', separator = false, key1 = '', key2 = ''}) {
  const classes = useStyles();

  const positionRef = React.useRef({
  x: 0,
  y: 0,
});

const popperRef = React.useRef(null);
const areaRef = React.useRef(null);
  return (
      <Tooltip
        classes={{arrow: classes.arrow}}
        title={<Content>
          {headText && <Text align='center'>
            <Bold>{headText}</Bold> {key1 && <Span>{key1}</Span>}{key2 && <Span>{key2}</Span>}
          </Text>}
          {separator && <HLine />}
          <Text align='center'>
            {content}
          </Text>
        </Content>}
        placement="bottom"
        arrow
      >
      <div style={{ top: 200, left: 100, position: 'absolute' }}>
        <Button
          ref={areaRef}
          variant="outlined"
          style={{color: 'white'}}
          startIcon={<AddIcon />}>
          Add Subtask
        </Button>
        </div>
      </Tooltip>

  );
}
