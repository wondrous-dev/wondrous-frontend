import SubmissionStatus from 'components/Common/SubmissionStatus';
import {
  CommentProfilePicture,
  CommentText,
  CommentTopFlexDiv,
  Container,
  Creator,
  DefaultCommentProfilePicture,
  DeleteText,
  ProfileCommentContainer,
  Role,
  RoleStatusWrapper,
  TimeText,
} from './styles';

const CommentItem = (props) => {
  const {
    actorProfilePicture,
    actorUsername,
    canEdit,
    commentRef,
    commentText,
    handleOnDelete,
    isOpenedFromNotification,
    role = null,
    type = null,
    timeText,
  } = props;
  return (
    <Container ref={commentRef} highlight={isOpenedFromNotification}>
      <RoleStatusWrapper>
        {role && <Role>{role}</Role>}
        {type && <SubmissionStatus status={type} />}
      </RoleStatusWrapper>
      <ProfileCommentContainer>
        {actorProfilePicture ? <CommentProfilePicture src={actorProfilePicture} /> : <DefaultCommentProfilePicture />}
        <div>
          <CommentTopFlexDiv>
            <Creator>{actorUsername}</Creator>
            <TimeText>{timeText}</TimeText>
          </CommentTopFlexDiv>
          <CommentText>{commentText}</CommentText>
          {canEdit && <DeleteText onClick={handleOnDelete}>Delete</DeleteText>}
        </div>
      </ProfileCommentContainer>
    </Container>
  );
};

export default CommentItem;
