import { Typography } from '@material-ui/core';
import styled from 'styled-components';
import { SafeImage } from '../Image';
import DefaultUserImage from '../Image/DefaultUserImage';

export const PostHeaderWrapper = styled.div`
  display: flex;
  align-items: flex-start;
`;

export const PostHeaderImage = (props) => (
  <SafeImage
    {...props}
    style={{
      width: '28px',
      height: '28px',
    }}
  />
);

export const PostHeaderDefaultUserImage = (props) => (
  <DefaultUserImage
    {...props}
    style={{
      width: '28px',
      height: '28px',
    }}
  />
);

export const PostHeaderText = styled(Typography)`
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
