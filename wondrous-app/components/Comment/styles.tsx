import { Typography } from '@material-ui/core';
import styled from 'styled-components';
import { White } from '../../theme/colors';
import { SafeImage } from '../Common/Image';
import DefaultUserImage from '../Common/Image/DefaultUserImage';
import { CreateFormPreviewButton } from '../CreateEntity/styles';

export const CommentListWrapper = styled.div`
  margin-top: 16px;
`;

export const CommentListContainer = styled.div`
  margin-top: 16px;
`;

export const CommentItemContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
`;

export const CommentProfilePicture = (props) => (
  <SafeImage
    src={props?.src}
    style={{
      width: '32px',
      height: '32px',
      borderRadius: '16px',
      marginRight: '12px',
    }}
  />
);

export const DefaultCommentProfilePicture = (props) => (
  <DefaultUserImage
    style={{
      width: '32px',
      height: '32px',
      borderRadius: '16px',
      marginRight: '12px',
    }}
  />
);

export const CommentTopFlexDiv = styled.div`
  display: flex;
  align-items: center;
`;

export const CommentText = styled(Typography)`
  && {
    font-size: 13px;
    line-height: 20px;
    color: ${White};
    text-align: left;
    white-space: pre-line;
  }
`;

export const AddCommentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
export const AddCommentButton = styled(CreateFormPreviewButton)`
  && {
    margin-top: 16px;
    align-self: flex-end;
  }
`;

export const DeleteText = styled(Typography)`
  && {
    color: white;
    text-decoration: underline;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
  }
`;
