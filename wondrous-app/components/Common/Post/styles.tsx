import { Box } from '@material-ui/core';
import styled from 'styled-components';

export const PostWrapper = styled(Box)`
  max-width: 680px;
  position: relative;
  border-left: 1px dashed #4b4b4b;
  display: flex;
`;

export const PostBorderDashedFirstChild = styled.div`
  display: none; // NOTE: set in Feed styled component
  border-left: 1px dashed #4b4b4b;
  position: relative;
  width: 1px;
  margin-top: 54px;
  :before {
    content: '';
    position: absolute;
    left: -6px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #707070;
  }
`;

export const PostBorderDashedLastChild = styled.div`
  display: none; // NOTE: set in Feed styled component
  border-left: 1px dashed #4b4b4b;
  position: relative;
  width: 1px;
  height: 52px;
  :before {
    content: '';
    position: absolute;
    left: -6px;
    width: 12px;
    height: 12px;
    top: 52px;
    border-radius: 50%;
    background-color: #707070;
  }
`;

export const PostBorderDashedCircle = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 100%;
  background-color: #707070;
  display: block;
  position: absolute;
  top: 54px;
  left: -6px; ;
`;

export const PostBorder = styled(Box)`
  background: linear-gradient(169.47deg, rgba(75, 75, 75, 0.6) 7.84%, rgba(35, 35, 35, 0.6) 108.71%);
  border-radius: 6px;
  padding: 1px;
  margin-left: 65px;
  margin-top: 30px;
  width: 100%;
`;

export const PostBackground = styled(Box)`
  background: #0f0f0f;
  border-radius: inherit;
`;
