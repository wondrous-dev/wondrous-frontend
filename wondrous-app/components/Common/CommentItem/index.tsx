import { Grid } from '@mui/material';
import SubmissionStatus from 'components/Common/SubmissionStatus';
import {
  CommentProfilePicture,
  CommentText,
  Container,
  Creator,
  DefaultCommentProfilePicture,
  DeleteText,
  Role,
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
      <Grid container justifyContent="flex-start" alignItems="center" spacing={{ gap: '4px' }}>
        {role && <Role>{role}</Role>}
        {type && <SubmissionStatus status={type} />}
      </Grid>
      <Grid container>
        {actorProfilePicture ? <CommentProfilePicture src={actorProfilePicture} /> : <DefaultCommentProfilePicture />}
        <div>
          <Grid container justifyContent="flex-start" alignItems="center">
            <Creator>{actorUsername}</Creator>
            <TimeText>{timeText}</TimeText>
          </Grid>
          <CommentText>{commentText}</CommentText>
          {canEdit && <DeleteText onClick={handleOnDelete}>Delete</DeleteText>}
        </div>
      </Grid>
    </Container>
  );
};

export default CommentItem;
