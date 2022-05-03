import { Blue800 } from 'theme/colors';
import styled from 'styled-components';
import Typography from '@mui/material/Typography';

export const WhiteTypography = styled(Typography)`
  && {
    color: white;
    font-weight: 700;
    font-size: 15px;
    line-height: 19px;
  }
`;

export const DescriptionTypography = styled(Typography)`
  && {
    color: white;
    max-height: 60px;
    padding-right: 1em;
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    letter-spacing: 0.01em;
  }
`;

const styles = {
  gridItem: {
    padding: 1.5,
    backgroundColor: Blue800,
    borderRadius: '3px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    color: 'primary.contrastText',
    ':hover': {
      background: '#353434',
      'p:after': {
        background: '#353434',
      },
    },
  },
  imageContainer: {
    position: 'relative',
    height: 170,
    // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
    // overflow: 'hidden',
    img: {
      // flexShrink: 0,
      // minWidth: ' 100%',
      // minHeight: '100%',
    },
  },
  description: {
    overflow: 'hidden',
    position: 'relative',
    maxHeight: 60,
    textAlign: 'justify',
    paddingRight: '1em',
    '&:before': {
      content: '"..."',
      position: 'absolute',
      right: 0,
      bottom: 0,
    },
    '&:after': {
      content: '""',
      position: 'absolute',
      right: 0,
      width: '1em',
      height: '1em',
      marginTop: '0.2em',
      background: Blue800,
    },
  },
};

export default styles;
