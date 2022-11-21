import { Box, Grid } from '@mui/material';
import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import SubmissionCommentType from 'components/Common/SubmissionCommentType';
import palette from 'theme/palette';
import { Container } from './styles';

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
      <Grid container justifyContent="flex-start" alignItems="center" gap="4px">
        {role && (
          <Box
            color={palette.blue20}
            padding="4px 8px"
            height="26px"
            fontWeight="500"
            fontSize="14px"
            borderRadius="4px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              background: palette.grey99,
            }}
          >
            {role}
          </Box>
        )}
        {type && <SubmissionCommentType status={type} />}
      </Grid>
      <Grid container>
        {actorProfilePicture ? (
          <SafeImage
            src={actorProfilePicture}
            useNextImage={false}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '16px',
              marginRight: '12px',
            }}
            alt="Actor profile picture"
          />
        ) : (
          <DefaultUserImage
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '16px',
              marginRight: '12px',
            }}
          />
        )}
        <div>
          <Grid container justifyContent="flex-start" alignItems="center">
            <Box
              sx={{
                color: palette.white,
                fontSize: '13px',
                lineHeight: '20px',
                fontWeight: 'bold',
                marginRight: '8px',
              }}
            >
              {actorUsername}
            </Box>
            <Box
              sx={{
                color: palette.grey51,
                fontSize: '13px',
                lineHeight: '20px',
              }}
            >
              {timeText}
            </Box>
          </Grid>
          <Box
            sx={{
              fontSize: '13px',
              lineHeight: '20px',
              color: palette.white,
              textAlign: 'left',
              whiteSpace: 'pre-line',
            }}
          >
            {commentText}
          </Box>
          {canEdit && (
            <Box
              onClick={handleOnDelete}
              sx={{
                color: 'white',
                textDecoration: 'underline',
                fontSize: '13px',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              Delete
            </Box>
          )}
        </div>
      </Grid>
    </Container>
  );
};

export default CommentItem;
