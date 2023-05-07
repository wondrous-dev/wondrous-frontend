import { MediaItem } from './MediaItem';
import styled from 'styled-components';
import { Typography } from '@mui/material';
import ReactPlayer from 'react-player';

export const TaskMediaContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 8px;
  height: 32px;
  > a > div {
    height: 32px;
    margin: 0;
  }
`;

export const MediaImageVideoTextWrapper = styled.div`
  height: 28px;
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
`;

export const TaskMediaItem = styled(MediaItem)`
  && {
  }
`;

export const Filename = styled(Typography)`
  && {
    font-size: 12px;
    color: black;
    font-weight: 500;
    font-family: 'Poppins';
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

export const MediaItemWrapper = styled.div`
  height: max-content;
  border-radius: 4px;
  position: relative;
  display: flex;
  background: #c6bbfc;
  align-items: center;
  width: fit-content;
  padding: 2px 4px;
  flex-wrap: wrap;
  gap: 8px;
`;
