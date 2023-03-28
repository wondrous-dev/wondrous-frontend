import { useMe } from 'components/Auth/withAuth';
import TaskMintComponent from 'components/Common/TaskMint';
import { entityTypeData, Fields } from 'components/CreateEntity/CreateEntityModal/Helpers';
import { useMemo } from 'react';
import { CATEGORY_LABELS, GR15DEICategoryName } from 'utils/constants';
import { useBoards } from 'utils/hooks';
import { hasGR15DEIIntiative } from '../utils';
import ApplicationField from './ApplicationField';
import AssigneeField from './AssigneeField';
import CategoryField from './CategoryField';
import DueDateField from './DueDateField';
import InitiativesField from './InitiativesField';
import MilestoneField from './MilestoneField';
import PointsField from './PointsField';
import PriorityField from './PriorityField';
import ProposerField from './ProposerField';
import ReviewerField from './ReviewerField';
import RewardsField from './RewardsField';
import StatusField from './StatusField';
import TagsField from './TagsField';
import WatchersField from './WatchersField';

// to offload some of the display logic from the TaskViewModal component

const ModalFields = ({
  fetchedTask,
  isViewNft,
  setIsViewNft,
  canEdit,
  isTaskProposal,
  canArchive,
  isMilestone,
  reviewerData,
  canApply,
  canClaim,
  showAssignee,
  canViewApplications,
  taskApplicationCount,
  handleReviewButton,
  handleClose,
  entityType,
  isSubtask,
  taskSubmissionsForTask,
  isBounty,
}) => {
  const user = useMe();
  const board: any = useBoards();

  const remaininTaskCategories = useMemo(
    () =>
      fetchedTask?.categories
        ?.filter((category) => category?.name !== GR15DEICategoryName)
        .map((category) => {
          const newCategory = {
            ...category,
            name: CATEGORY_LABELS[category?.name],
          };
          return newCategory;
        }),
    [fetchedTask]
  );
  return (
    <>
      <TaskMintComponent
        assigneeId={fetchedTask?.assigneeId}
        taskStatus={fetchedTask?.status}
        taskMintData={fetchedTask?.taskMint}
        isViewNft={isViewNft}
        setIsViewNft={setIsViewNft}
        taskId={fetchedTask?.id}
        isBounty={isBounty}
        isMilestone={isMilestone}
        taskSubmissionsForTask={taskSubmissionsForTask}
      />
      <StatusField
        shouldDisplay={!isViewNft}
        canEdit={canEdit}
        isTaskProposal={isTaskProposal}
        canArchive={canArchive}
      />
      <ReviewerField
        shouldDisplay={!(isMilestone || isTaskProposal)}
        reviewerData={reviewerData}
        canEdit={canEdit}
        fetchedTask={fetchedTask}
        user={user}
      />
      <AssigneeField
        canApply={canApply}
        canClaim={canClaim}
        canEdit={canEdit}
        fetchedTask={fetchedTask}
        orgId={board?.orgId}
        podId={board?.podId}
        shouldDisplay={showAssignee}
        user={user}
        userId={board?.userId}
      />
      {!isViewNft && <WatchersField fetchedTask={fetchedTask} entityType={entityType} />}

      <ApplicationField
        shouldDisplay={canViewApplications && taskApplicationCount?.getTaskApplicationsCount?.total > 0}
        taskApplicationCount={taskApplicationCount}
        handleReviewButton={handleReviewButton}
      />
      <ProposerField
        shouldDisplay={isTaskProposal && !isMilestone}
        creatorProfilePicture={fetchedTask?.creatorProfilePicture}
        creatorUsername={fetchedTask?.creatorUsername}
        handleClose={handleClose}
      />
      <DueDateField
        shouldDisplay={entityTypeData[entityType].fields.includes(Fields.dueDate)}
        canEdit={canEdit}
        dueDate={fetchedTask?.dueDate}
        recurringSchema={fetchedTask?.recurringSchema}
        shouldUnclaimOnDueDateExpiry={fetchedTask?.shouldUnclaimOnDueDateExpiry}
      />
      <RewardsField
        fetchedTask={fetchedTask}
        canEdit={canEdit}
        shouldDisplay={entityTypeData[entityType].fields.includes(Fields.reward)}
      />
      <PointsField
        shouldDisplay={entityTypeData[entityType].fields.includes(Fields.points)}
        points={fetchedTask?.points}
        canEdit={canEdit}
      />
      <MilestoneField
        shouldDisplay={entityTypeData[entityType].fields.includes(Fields.milestone)}
        milestoneId={fetchedTask?.milestoneId}
        canEdit={canEdit}
        isSubtask={isSubtask}
        orgId={fetchedTask?.orgId}
        podId={fetchedTask?.podId}
        milestoneTitle={fetchedTask?.milestone?.title || fetchedTask?.milestoneTitle}
      />
      <PriorityField
        priority={fetchedTask?.priority}
        canEdit={canEdit}
        shouldDisplay={entityTypeData[entityType].fields.includes(Fields.priority)}
      />
      <CategoryField
        labels={remaininTaskCategories}
        canEdit={canEdit}
        shouldDisplay={entityTypeData[entityType].fields.includes(Fields.categories)}
      />
      <TagsField
        canEdit={canEdit}
        shouldDisplay={entityTypeData[entityType].fields.includes(Fields.tags)}
        labels={fetchedTask?.labels}
        orgId={fetchedTask?.orgId}
      />
      <InitiativesField shouldDisplay={hasGR15DEIIntiative(fetchedTask?.categories)} />
    </>
  );
};

export default ModalFields;
