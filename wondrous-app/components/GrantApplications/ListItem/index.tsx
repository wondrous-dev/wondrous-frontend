import { Grid, Typography } from '@mui/material';
import { useMe } from 'components/Auth/withAuth';
import { Button } from 'components/Button';
import { TaskActionAmount } from 'components/Common/Task/styles';
import {
  SubmissionDescription,
  SubmissionDivider,
  SubmissionItemFooter,
  SubmissionItemHeader,
  SubmissionItemHeaderContent,
  SubmissionItemSection,
  SubmissionItemWrapper,
} from 'components/Common/TaskSubmission/styles';
import { SubmissionItemStatus, SubmissionItemUserWrapper } from 'components/Common/TaskSubmission/submissionItem';
import { TaskDescriptionTextWrapper } from 'components/Common/TaskViewModal/helpers';
import { TaskCommentIcon } from 'components/Icons/taskComment';
import { RequestApproveButton } from 'components/organization/members/styles';
import { RichTextViewer } from 'components/RichText';
import { selectApplicationStatus } from 'components/ViewGrant/utils';
import { useRouter } from 'next/router';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { GRANT_APPLICATION_STATUSES } from 'utils/constants';
import { delQuery } from 'utils/index';
import { useLocation } from 'utils/useLocation';
import { ApplicationItemContainer, ApplicationItemWrapper, Footer } from './styles';

const EDITABLE_STATUSES = [
  GRANT_APPLICATION_STATUSES.OPEN,
  GRANT_APPLICATION_STATUSES.CHANGE_REQUESTED,
  GRANT_APPLICATION_STATUSES.WAITING_FOR_REVIEW,
];

const ListItem = ({ item }) => {
  const router = useRouter();
  const user = useMe();
  const location = useLocation();
  const status = selectApplicationStatus(item);
  const handleClick = (applicationId, query = '') => {
    let newUrl = `${delQuery(router.asPath)}?grant=${router.query.grant}&grantApplicationId=${applicationId}`;
    newUrl += query;
    location.push(newUrl);
    document.body.setAttribute('style', `position: fixed; top: -${window.scrollY}px; left:0; right:0`);
  };

  const canEdit = item?.createdBy === user?.id && EDITABLE_STATUSES.includes(status);

  return (
    <ApplicationItemWrapper>
      <ApplicationItemContainer>
        <SubmissionItemHeader>
          <SubmissionItemHeaderContent>
            <SubmissionItemUserWrapper
              creatorUsername={item?.creator?.username}
              creatorProfilePicture={item?.creator?.profilePicture}
            />
            <SubmissionItemHeader createdAt={item?.createdAt} />
          </SubmissionItemHeaderContent>
          <Grid display="flex" gap="12px" alignItems="center">
            {canEdit && (
              <Button
                buttonTheme={{
                  background: palette.grey85,
                }}
                paddingX="16"
                paddingY="7"
                color="grey"
                onClick={() => handleClick(item?.id, '&edit=true')}
                height={26}
              >
                Edit
              </Button>
            )}
            <SubmissionItemStatus submission={item} />
          </Grid>
        </SubmissionItemHeader>
        <SubmissionDivider />
        <SubmissionItemSection>
          <Typography fontFamily={typography.fontFamily} fontWeight={600} fontSize="15px" color={palette.white}>
            {item?.title}
          </Typography>
          <SubmissionDescription>
            <TaskDescriptionTextWrapper text={item?.description} />
          </SubmissionDescription>
        </SubmissionItemSection>
      </ApplicationItemContainer>
      <Footer>
        <TaskCommentIcon />
        <TaskActionAmount>{item?.commentCount}</TaskActionAmount>
        <RequestApproveButton onClick={() => handleClick(item?.id)}>View application</RequestApproveButton>
      </Footer>
    </ApplicationItemWrapper>
  );
};

export default ListItem;
