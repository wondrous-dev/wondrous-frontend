import {
  SubmissionFilterButtonIcon,
  SubmissionFilterSelectButton,
  SubmissionFilterSelectItem,
  SubmissionFilterSelectMenu,
  SubmissionFilterStatusIcon,
  SubmissionItemStatusChangesRequestedIcon,
} from 'components/Common/TaskSubmission/styles';
import { TaskSubmissionsFilterSelected } from 'components/Common/TaskSubmission/submissionFilter';
import { InReviewIcon, CompletedIcon, RejectedIcon } from 'components/Icons/statusIcons';
import { useMemo, useState } from 'react';
import { GRANT_APPLICATION_STATUSES } from 'utils/constants';

const filterOptions = [
  { label: 'All applications', Icon: SubmissionFilterStatusIcon, value: GRANT_APPLICATION_STATUSES.OPEN },
  { label: 'Awaiting Review', Icon: InReviewIcon, value: GRANT_APPLICATION_STATUSES.WAITING_FOR_REVIEW },
  {
    label: 'Changes Requested',
    Icon: SubmissionItemStatusChangesRequestedIcon,
    value: GRANT_APPLICATION_STATUSES.CHANGE_REQUESTED,
  },
  { label: 'Approved', Icon: CompletedIcon, value: GRANT_APPLICATION_STATUSES.APPROVED },
  { label: 'Rejected', Icon: RejectedIcon, value: GRANT_APPLICATION_STATUSES.REJECTED },
];

// OPEN = 'open'
// WAITING_FOR_REVIEW = 'waiting_for_review'
// CHANGE_REQUESTED = 'change_requested'
// APPROVED = 'approved'
// REJECTED = 'rejected'

const Filters = ({ setStatus, status }) => {
  // const [selected, setSelected] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const handleOnClick = (value) => {
    // setSelected({ Icon, label });
    setStatus(value);
    handleClose();
  };

  const selected = useMemo(() => filterOptions.find((option) => option.value === status), [status])

  return (
    <>
      <SubmissionFilterSelectButton onClick={handleClick} open={open}>
        <TaskSubmissionsFilterSelected value={selected} />
        <SubmissionFilterButtonIcon open={open} />
      </SubmissionFilterSelectButton>
      <SubmissionFilterSelectMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {filterOptions.map(({ Icon, label, value }) => (
          <SubmissionFilterSelectItem key={value} value={value} onClick={() => handleOnClick(value)}>
            <Icon /> {label}
          </SubmissionFilterSelectItem>
        ))}
      </SubmissionFilterSelectMenu>
    </>
  );
};

export default Filters;
