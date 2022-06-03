import palette from 'theme/palette';
import styled from 'styled-components';
import Typography from '@mui/material/Typography';

export const WhiteTypography = styled(Typography)`
  && {
    color: white;
    font-weight: 700;
    font-size: 15px;
    line-height: 19px;
    flex-wrap: wrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3; // max nb lines to show
    -webkit-box-orient: vertical;
  }
`;

export const DescriptionTypography = styled(Typography)`
  && {
    color: white;
    overflow: hidden;
    position: relative;
    max-height: 60px;
    text-align: justify;
    padding-right: 1em;
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
    letter-spacing: 0.01em;

    &:before: {
      content: '...';
      position: absolute;
      right: 0;
      bottom: 0;
    }

    &:after: {
      content: ' ';
      background: ${palette.blue800};
      position: absolute;
      right: 0;
      width: 1em;
      height: 1em;
      margin-top: 0.2em;
    }
  }
`;

const styles = {
  listItem: {
    padding: 1.5,
    backgroundColor: palette.blue800,
    borderRadius: '3px',
    display: 'flex',
    ':hover': {
      background: '#353434',
    },
  },
  imageContainer: {
    position: 'relative',
    minWidth: 220,
  },
};

export default styles;
