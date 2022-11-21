import { CompletedIcon, InReviewIcon } from 'components/Icons/statusIcons';
import isEmpty from 'lodash/isEmpty';
import values from 'lodash/values';
import { useState } from 'react';
import { PAYMENT_STATUS } from 'utils/constants';
import {
  SubmissionFilterButtonIcon,
  SubmissionFilterSelectButton,
  SubmissionFilterSelectItem,
  SubmissionFilterSelectMenu,
  SubmissionFilterSelectRender,
  SubmissionFilterStatusIcon,
  SubmissionItemStatusChangesRequestedIcon,
} from './styles';

const filterOptions = {
  allSubmissions: { label: 'All Submissions', Icon: SubmissionFilterStatusIcon },
  awaitingReview: { label: 'Awaiting Review', Icon: InReviewIcon },
  changesRequested: { label: 'Changes Requested', Icon: SubmissionItemStatusChangesRequestedIcon },
  approved: { label: 'Approved', Icon: CompletedIcon },
  approvedAndProcessingPayment: { label: 'Approved And Processing Payment', Icon: CompletedIcon },
  approvedAndPaid: { label: 'Approved and Paid', Icon: CompletedIcon },
};

const isSubmissionStatus = ({ submission, label }) => {
  const { allSubmissions, awaitingReview, changesRequested, approved, approvedAndProcessingPayment, approvedAndPaid } =
    filterOptions;
  const conditions = {
    [allSubmissions.label]: true,
    [awaitingReview.label]: !submission?.approvedAt && !submission?.changeRequestedAt && !submission.rejectedAt,
    [changesRequested.label]: submission?.changeRequestedAt || submission?.rejectedAt,
    [approved.label]: submission?.approvedAt,
    [approvedAndProcessingPayment.label]:
      submission?.approvedAt && submission?.paymentStatus === PAYMENT_STATUS.PROCESSING,
    [approvedAndPaid.label]: submission?.approvedAt && submission?.paymentStatus === PAYMENT_STATUS.PAID,
  };
  return conditions[label];
};

export function TaskSubmissionsFilterSelected({ value }) {
  return isEmpty(value) ? (
    <SubmissionFilterSelectRender>
      <SubmissionFilterStatusIcon /> Status
    </SubmissionFilterSelectRender>
  ) : (
    <SubmissionFilterSelectRender>
      <value.Icon /> {value.label}
    </SubmissionFilterSelectRender>
  );
}

export function TaskSubmissionsFilter({ fetchedTaskSubmissions, setFilteredSubmissions }) {
  const [selected, setSelected] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const handleOnClick = ({ Icon, label }) => {
    setSelected({ Icon, label });
    const handleFilterStatus = (submission) => isSubmissionStatus({ submission, label });
    setFilteredSubmissions(fetchedTaskSubmissions.filter(handleFilterStatus));
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
}
