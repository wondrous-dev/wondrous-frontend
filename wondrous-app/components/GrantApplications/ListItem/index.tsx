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
import { Button } from 'components/Button';
import { Grid, Typography } from '@mui/material';
import palette from 'theme/palette';
import { RichTextViewer } from 'components/RichText';
import typography from 'theme/typography';
import { TaskActionAmount } from 'components/Common/Task/styles';
import { TaskCommentIcon } from 'components/Icons/taskComment';
import { RequestApproveButton } from 'components/organization/members/styles';
import { useRouter } from 'next/router';
import { delQuery } from 'utils/index';
import { useLocation } from 'utils/useLocation';
import { ApplicationItemContainer, ApplicationItemWrapper, Footer } from './styles';

const ListItem = ({ item }) => {
  const router = useRouter();
  const location = useLocation();
  const { query } = router;

  const handleClick = (applicationId) => {
    const newUrl = `${delQuery(router.asPath)}?grant=${query.grant}&grantApplicationId=${applicationId}`;
    location.push(newUrl);
    document.body.setAttribute('style', `position: fixed; top: -${window.scrollY}px; left:0; right:0`);
  };

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
            <Button
              buttonTheme={{
                background: palette.grey85,
              }}
              paddingX="16"
              paddingY="7"
              color="grey"
              onClick={() => {}}
              height={26}
            >
              Edit
            </Button>
            <SubmissionItemStatus submission={item} />
          </Grid>
        </SubmissionItemHeader>
        <SubmissionDivider />
        <SubmissionItemSection>
          <Typography fontFamily={typography.fontFamily} fontWeight={600} fontSize="15px" color={palette.white}>
            {item?.title}
          </Typography>
          <SubmissionDescription>
            <RichTextViewer text={item?.description} />
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
