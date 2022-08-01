import Accordion from 'components/Common/ListViewAccordion';
import ColumnEntry from './ColumnEntry';
import {
  ADMIN_COLUMNS_TYPES,
  TASK_STATUS_SUBMISSION_REQUEST,
  TASK_STATUS_PROPOSAL_REQUEST,
  MEMBERSHIP_REQUESTS,
} from 'utils/constants';
import { InReviewIcon, MembershipRequestIcon, ProposalsRemainingIcon } from 'components/Icons/statusIcons';
import { useUserBoard } from 'utils/hooks';
interface ColumnItem {
  type: string;
  items: Array<any>;
  hasMore: boolean;
}

interface Props {
  columns: ColumnItem[];
  onLoadMore: () => any;
}

const ICON_MAP = {
  [TASK_STATUS_SUBMISSION_REQUEST]: InReviewIcon,
  [TASK_STATUS_PROPOSAL_REQUEST]: ProposalsRemainingIcon,
  [MEMBERSHIP_REQUESTS]: MembershipRequestIcon,
};

const COUNTS_MAP = {
  [TASK_STATUS_SUBMISSION_REQUEST]: 'submissionRequestCount',
  [TASK_STATUS_PROPOSAL_REQUEST]: 'proposalRequestCount',
  [MEMBERSHIP_REQUESTS]: 'membershipRequestCount',
};

function ListViewAdmin({ columns, onLoadMore }: Props) {
  const board = useUserBoard();

  const { adminWorkflowCount } = board;

  const generateCount = (type) => {
    if (type && adminWorkflowCount) {
      const countType = COUNTS_MAP[type];

      return type === MEMBERSHIP_REQUESTS
        ? adminWorkflowCount?.podMembershipRequestCount + adminWorkflowCount?.orgMembershipRequestCount
        : adminWorkflowCount[countType];
    }
    return 0;
  };
  return (
    <>
      {columns.map((column, colIdx) => {
        if (!column) return null;
        const title = ADMIN_COLUMNS_TYPES[column.type];
        const Icon = ICON_MAP[column.type];
        const count = generateCount(column.type);
        return (
          <Accordion
            isExpanded={column?.items?.length > 0}
            key={colIdx}
            title={title}
            count={count}
            Icon={Icon}
            headerAddons={null}
            displayShowMore={column.hasMore}
            onShowMore={onLoadMore}
          >
            {column?.items.map((item, idx) => (
              <ColumnEntry
                key={idx}
                type={column.type}
                userProfilePicture={item.userProfilePicture}
                orgUsername={item.orgUsername}
                orgProfilePicture={item.orgProfilePicture}
                podColor={item.podColor}
                podId={item.podId}
                podName={item.podName}
                userId={item.userId}
                userUsername={item.userUsername}
                id={item.id}
                creatorProfilePicture={item.creatorProfilePicture}
                creatorUsername={item.creatorUsername}
                description={item.description}
                message={item.message}
                title={item.title}
                commentCount={item.commentCount}
                taskId={item.taskId}
              />
            ))}
          </Accordion>
        );
      })}
    </>
  );
}

export default ListViewAdmin;
