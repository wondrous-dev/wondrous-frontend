import { Typography } from '@mui/material';
import styled from 'styled-components';
import palette from 'theme/palette';
import ReactPlayer from 'react-player/lazy';

export const MediaItemWrapper = styled.div`
  height: max-content;
  background: ${palette.grey85};
  border-radius: 4px;
  position: relative;
  display: flex;
  align-items: center;
  width: fit-content;
  padding: 2px;
  flex-wrap: wrap;
  gap: 8px;
`;

export const MediaImageVideoTextWrapper = styled.div`
  height: 28px;
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
`;

export const Filename = styled(Typography)`
  && {
    font-size: 14px;
    color: ${palette.white};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }
`;

export const TaskVideo = styled(ReactPlayer)`
  display: flex;
  flex-grow: 1;
  border-radius: 6px;
  margin: 0 auto;
  iframe {
    border-radius: 10px;
  }
`;
