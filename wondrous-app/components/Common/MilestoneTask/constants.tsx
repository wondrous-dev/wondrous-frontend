import { Done, InProgress, InReview, ToDo } from 'components/Icons';
import FilterStatusIcon from 'components/Icons/filterStatusIcon.svg';
import { ArchivedIcon } from 'components/Icons/statusIcons';
import styled from 'styled-components';
import * as Constants from 'utils/constants';

const MilestoneTaskFilterStatusIcon = styled(({ className }) => (
  <div className={className}>
    <FilterStatusIcon />
  </div>
))`
  && {
    background: ${({ theme }) => theme.palette.background.default};
    height: 26px;
    width: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
  }
`;

const TASK_ICONS_LABELS = {
  '': { Icon: MilestoneTaskFilterStatusIcon, label: 'All Tasks' },
  [Constants.TASK_STATUS_TODO]: { Icon: ToDo, label: 'To Do' },
  [Constants.TASK_STATUS_IN_PROGRESS]: { Icon: InProgress, label: 'In Progress' },
  [Constants.TASK_STATUS_IN_REVIEW]: { Icon: InReview, label: 'In Review' },
  [Constants.TASK_STATUS_DONE]: { Icon: Done, label: 'Completed' },
  [Constants.TASK_STATUS_ARCHIVED]: { Icon: ArchivedIcon, label: 'Archived' },
};

export default TASK_ICONS_LABELS;
