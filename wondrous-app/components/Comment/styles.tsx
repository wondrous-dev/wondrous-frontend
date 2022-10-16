import { Typography } from '@mui/material';
import Button from 'components/Button';
import { GradientHighlightHorizontal } from 'components/Common/gradients';
import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import { EmptyStateCommentsIcon } from 'components/Icons/emptyStates';
import styled from 'styled-components';
import palette from 'theme/palette';
import typography from 'theme/typography';

export const CommentListWrapper = styled.div``;

export const CommentListContainer = styled.div`
  margin-top: 16px;
`;

export const CommentListEmptyStateContainer = styled.div`
  width: 100%;
  padding: 14px 0;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

export const CommentListEmptyStateIcon = styled(EmptyStateCommentsIcon)``;

export const CommentListEmptyStateText = styled(Typography)`
  && {
    font-size: 13px;
    font-weight: 400;
    color: ${({ theme }) => theme.palette.grey57};
    text-align: center;
  }
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
      background: ${palette.grey250};
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

export function CommentProfilePicture(props) {
  return (
    <SafeImage
      src={props?.src}
      useNextImage={false}
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '16px',
        marginRight: '12px',
      }}
    />
  );
}

export function DefaultCommentProfilePicture(props) {
  return (
    <DefaultUserImage
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '16px',
        marginRight: '12px',
      }}
    />
  );
}

export const CommentTopFlexDiv = styled.div`
  display: flex;
  align-items: center;
`;

export const CommentText = styled(Typography)`
  && {
    font-size: 13px;
    line-height: 20px;
    color: ${palette.white};
    text-align: left;
    white-space: pre-line;
  }
`;

export const AddCommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-top: 12px;
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
export const AddCommentButton = styled(Button)`
  && {
    margin-top: 16px;
    align-self: flex-end;
    color: ${palette.white};
    font-family: ${typography.fontFamily};
    font-weight: 500;
    font-size: 14px;
    height: 40px;
    min-height: fit-content;
    width: fit-content;
    z-index: 1;
    > button {
      background: ${palette.background.default};
      height: 38px;
      padding: 0 18px;
      :hover {
        background: ${palette.background.default};
      }
    }
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

export const DiscordDiscussionButtonWrapper = styled.div`
  background: ${palette.grey910};
  width: 100%;
  border-radius: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
`;
