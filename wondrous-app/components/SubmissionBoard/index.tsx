import { BoardsCardMedia } from 'components/Common/Boards/styles';
import { SafeImage } from 'components/Common/Image';
import { useRouter } from 'next/router';
import { TaskAction, TaskActionAmount } from 'components/Common/Task/styles';
import { OrgProfilePicture } from 'components/Common/ProfilePictureHelpers';
import { RichTextViewer } from 'components/RichText';
import { IconsList, ICON_TYPES } from 'components/ListViewAdmin/ColumnEntry';
import Tooltip from 'components/Tooltip';
import { TaskCommentIcon } from 'components/Icons/taskComment';
import { RequestDeclineButton } from 'components/organization/members/styles';
import { SubmissionItemStatus } from 'components/Common/TaskSubmission/submissionItem';
import PodIconName from 'components/Common/PodIconName';
import {
  SubmissionCardWrapper,
  SubmissionCardHeader,
  SubmissionIconWrapper,
  SubmissionType,
  SubmissionDescription,
  SubmissionCardBody,
  LinksWrapper,
  SubmissionCardFooter,
  OrgButton,
  SubmissionIcon,
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
                  {task?.podName ? <PodIconName onClick={goToPod} name={task?.podName} color={task?.podColor} /> : null}
                  <SubmissionIcon>
                    <SubmissionItemStatus hideTitle submission={task} />
                  </SubmissionIcon>
                </SubmissionIconWrapper>

                <SubmissionType>Your bounty submission</SubmissionType>
              </SubmissionCardHeader>
              <SubmissionCardBody>
                <SubmissionDescription as="div">
                  <RichTextViewer text={task.description} />
                </SubmissionDescription>
                {task?.media?.[0] ? (
                  <BoardsCardMedia>
                    <SafeImage
                      useNextImage={false}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                      src={task?.media[0].slug}
                      alt="Task image"
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
                {!task?.approvedAt && <RequestDeclineButton type="button">Edit submission</RequestDeclineButton>}
              </SubmissionCardFooter>
            </SubmissionCardWrapper>
          ))
        : null}
    </>
  );
};

export default SubmissionBoard;
