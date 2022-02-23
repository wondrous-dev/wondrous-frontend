import { Typography } from '@material-ui/core';
import styled from 'styled-components';
import { SafeImage } from '../Image';
import DefaultUserImage from '../Image/DefaultUserImage';

export const PostActivityHeader = styled.div`
  display: flex;
  align-items: center;
`;

export const PostActivityHeaderImage = (props) => (
  <SafeImage
    {...props}
    style={{
      width: '28px',
      height: '28px',
    }}
  />
);

export const PostActivityDefaultUserImage = (props) => (
  <DefaultUserImage
    {...props}
    style={{
      width: '28px',
      height: '28px',
    }}
  />
);

export const PostActivityText = styled(Typography)`
  && {
    color: #fff;
    padding-left: 12px;
    font-size: 15px;
  }
`;

export const PostActivityHeaderUsername = styled(Typography)`
  && {
    color: #fff;
    font-weight: 700;
  }
`;
