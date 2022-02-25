import { Box, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { TaskMedia } from '../MediaPlayer';

export const PostQuoteBackground = styled(Box)`
  background: #1e1e1e;
  border-radius: inherit;
  padding: 14px;
`;

export const PostQuoteWrapper = styled.div``;

export const PostContentBorder = styled(Typography)`
  && {
    margin-left: 12px;
    background: linear-gradient(180deg, #ccbbff 0%, #7427ff 47.4%, #00baff 100%);
    padding-left: 1px;
  }
`;

export const PostContentBackground = styled(Box)`
  background: #1e1e1e;
  height: 100%;
  font-family: 'Space Grotesk';
  font-size: 14px;
  font-style: normal;
  color: #c4c4c4;
  padding: 14px 28px 18px 28px;
`;

export const PostReferenceBorder = styled(Box)`
  margin-left: 12px;
  background: linear-gradient(180deg, #ccbbff 0%, #7427ff 47.4%, #00baff 100%);
  border-radius: 0 3px 3px 3px;
  padding: 1px;
`;

export const PostReferenceBackground = styled(Box)`
  background: #1e1e1e;
  height: 100%;
  border-radius: inherit;
  padding: 18px 28px;
`;

export const ReferenceTitle = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 16px;
    color: #fff;
    font-weight: 700;
    padding-top: 18px;
  }
`;

export const ReferenceDescription = styled(Typography)`
  && {
    font-family: Space Grotesk;
    font-size: 14px;
    color: #c4c4c4;
  }
`;

export const ReferenceMediaWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  && > div {
    margin-top: 12px;
    flex-basis: 45%;
  }
`;

export const ReferenceMedia = styled(TaskMedia)``;
