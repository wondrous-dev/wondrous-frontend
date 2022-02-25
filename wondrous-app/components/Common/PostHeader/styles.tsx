import { MenuItem, Popper, Typography } from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import styled from 'styled-components';
import { SafeImage } from '../Image';
import DefaultUserImage from '../Image/DefaultUserImage';

export const PostHeaderWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export const PostHeaderImageTextWrapper = styled.div`
  display: flex;
`;

export const PostHeaderImage = (props) => (
  <SafeImage
    {...props}
    style={{
      width: '28px',
      height: '28px',
      'border-radius': '50%',
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

export const PostHeaderUsername = styled(Typography)`
  && {
    color: #fff;
    font-weight: 700;
  }
`;

export const PostHeaderMoreMenuWrapper = styled.span``;

export const PostHeaderMore = styled(MoreVert)`
  && {
    color: #545454;
    background-color: #0f0f0f;
    margin-left: auto;
    border-radius: 50%;
    padding: 1px;
    font-size: 20px;
  }
  :hover {
    cursor: pointer;
  }
`;

export const PostHeaderMenu = styled(Popper)`
  background-color: #0f0f0f;
  border-radius: 2px;
`;

export const PostHeaderMenuItem = styled(MenuItem)`
  &.MuiMenuItem-root {
    color: #fff;
    font-family: 'Space Grotesk';
    font-size: 14px;
    text-align: center;

    &:hover {
      background-color: #2f2f2f;
    }
  }
`;
