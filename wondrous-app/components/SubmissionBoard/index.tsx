import { BoardsCardMedia } from 'components/Common/Boards/styles';
import { SafeImage } from 'components/Common/Image';
import { useRouter } from 'next/router';
import EmptyStateBoards from 'components/EmptyStateBoards';
import { TaskAction, TaskActionAmount } from 'components/Common/Task/styles';
import { OrgProfilePicture, PodProfilePicture } from 'components/Common/ProfilePictureHelpers';
import { RichTextViewer } from 'components/RichText';
import { BountyIcon } from 'components/Common/BountyBoard/styles';
import { IconsList, ICON_TYPES } from 'components/ListViewAdmin/ColumnEntry';
import Tooltip from 'components/Tooltip';
import { TaskCommentIcon } from 'components/Icons/taskComment';
import { RequestDeclineButton } from 'components/organization/members/styles';
import {
  BountyIconWrapper,
  SubmissionCardWrapper,
  SubmissionCardHeader,
  SubmissionIconWrapper,
  SubmissionType,
  SubmissionDescription,
  SubmissionCardBody,
  LinksWrapper,
  SubmissionCardFooter,
  OrgButton,
} from './styles';

const SubmissionBoard = ({ tasks, handleCardClick }) => {
  const router = useRouter();

  const goToPod = (podId) =>
    router.push(`/pod/${podId}/boards`, undefined, {
      shallow: true,
    });

  const goToOrg = (orgId) => router.push(`/org/${orgId}/boards`, undefined, { shallow: true });

  const editSubmission = (taskId, submissionId) => handleCardClick({ id: taskId }, `&taskSubmissionId=${submissionId}`);

  return (
    <>
      {tasks?.length
        ? tasks.map((task) => (
            <SubmissionCardWrapper onClick={() => editSubmission(task.taskId, task.id)} key={task.id}>
              <SubmissionCardHeader>
                <SubmissionIconWrapper>
                  <OrgButton onClick={() => goToOrg(task?.orgId)} type="button">
                    <OrgProfilePicture
                      profilePicture={task?.orgProfilePicture}
                      style={{
                        width: '29px',
                        height: '28px',
                        borderRadius: task?.orgProfilePicture ? '4px' : '',
                        marginRight: '8px',
                      }}
                    />
                  </OrgButton>
                  {task?.podName ? (
                    <PodProfilePicture goToPod={goToPod} podId={task?.podId} podColor={task?.podColor} />
                  ) : null}
                  <BountyIconWrapper>
                    <BountyIcon />
                  </BountyIconWrapper>
                </SubmissionIconWrapper>

                <SubmissionType>Your bounty submission</SubmissionType>
              </SubmissionCardHeader>
              <SubmissionCardBody>
                <SubmissionDescription>
                  <RichTextViewer text={task.description} />
                </SubmissionDescription>
                {task?.media?.[0] ? (
                  <BoardsCardMedia>
                    <SafeImage
                      useNextImage={false}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                      src={task?.media[0].slug}
                    />
                  </BoardsCardMedia>
                ) : null}
                <LinksWrapper>
                  {task?.links ? <IconsList items={task?.links} /> : null}
                  {task?.media ? <IconsList items={task?.media} type={ICON_TYPES.MEDIA} /> : null}
                </LinksWrapper>
              </SubmissionCardBody>
              <SubmissionCardFooter>
                <Tooltip title="View comments" placement="top">
                  <TaskAction key={`task-comment-${task.id}`}>
                    <TaskCommentIcon />
                    <TaskActionAmount>{task?.commentCount}</TaskActionAmount>
                  </TaskAction>
                </Tooltip>
                <RequestDeclineButton type="button">Edit submission</RequestDeclineButton>
              </SubmissionCardFooter>
            </SubmissionCardWrapper>
          ))
        : null}
    </>
  );
};

export default SubmissionBoard;
