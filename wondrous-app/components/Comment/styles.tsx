import { Typography } from '@mui/material';
import styled from 'styled-components';
import { white } from 'theme/colors';
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
  ${({ highlight }) =>
    highlight &&
    `
    @keyframes highlightComment {
    from {
      background: ${Grey250};
   }
    to {
      background: transparent;
    }
  }
    animation-name: highlightComment;
    animation-duration: 2s;
    padding: 2px;
    border-radius: 4px
  `}
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
    color: ${white};
    text-align: left;
    white-space: pre-line;
  }
`;

export const AddCommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;
const editorPadding = 12;
const editorMinHeight = 100;
export const EditorContainer = styled.div`
  padding: ${editorPadding}px;
  min-height: ${editorMinHeight}px;
  border-radius: 6px;
  background: rgb(15, 15, 15);
  overflow: auto;
`;
export const EditorPlaceholder = styled.div`
  min-height: ${editorMinHeight - editorPadding * 2}px;
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

export const TextInputDiv = styled.div`
  height: 100px;
`;
