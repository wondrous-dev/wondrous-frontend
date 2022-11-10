import {
  SubmissionFilterButtonIcon,
  SubmissionFilterSelectButton,
  SubmissionFilterSelectItem,
  SubmissionFilterSelectMenu,
  SubmissionFilterStatusIcon,
  SubmissionItemStatusChangesRequestedIcon,
} from 'components/Common/TaskSubmission/styles';
import { TaskSubmissionsFilterSelected } from 'components/Common/TaskSubmission/submissionFilter';
import { InReviewIcon, CompletedIcon } from 'components/Icons/statusIcons';
import { values } from 'lodash';
import { useState } from 'react';

const filterOptions = {
  allApplications: { label: 'All applications', Icon: SubmissionFilterStatusIcon },
  awaitingReview: { label: 'Awaiting Review', Icon: InReviewIcon },
  changesRequested: { label: 'Changes Requested', Icon: SubmissionItemStatusChangesRequestedIcon },
  approved: { label: 'Approved', Icon: CompletedIcon },
};

const Filters = () => {
  const [selected, setSelected] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const handleOnClick = ({ Icon, label }) => {
    setSelected({ Icon, label });
    handleClose();
  };

  return (
    <>
      <SubmissionFilterSelectButton onClick={handleClick} open={open}>
        <TaskSubmissionsFilterSelected value={selected} />
        <SubmissionFilterButtonIcon open={open} />
      </SubmissionFilterSelectButton>
      <SubmissionFilterSelectMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {values(filterOptions).map(({ Icon, label }) => (
          <SubmissionFilterSelectItem key={label} value={label} onClick={() => handleOnClick({ Icon, label })}>
            <Icon /> {label}
          </SubmissionFilterSelectItem>
        ))}
      </SubmissionFilterSelectMenu>
    </>
  );
};

export default Filters;
