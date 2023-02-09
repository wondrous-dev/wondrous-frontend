import { useMe } from 'components/Auth/withAuth';
import TaskMintComponent from 'components/Common/TaskMint';
import { entityTypeData, Fields } from 'components/CreateEntity/CreateEntityModal/Helpers';
import { useMemo } from 'react';
import { updateProposalItem } from 'utils/board';
import { CATEGORY_LABELS, GR15DEICategoryName } from 'utils/constants';
import { useBoards, useColumns } from 'utils/hooks';
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
  getTaskById,
  isSubtask,
}) => {
  const user = useMe();
  const boardColumns = useColumns();
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
      />
      <StatusField
        shouldDisplay={!isViewNft}
        canEdit={canEdit}
        isTaskProposal={isTaskProposal}
        canArchive={canArchive}
      />
      <ReviewerField
        shouldDisplay={!isTaskProposal && !isMilestone && (canEdit || reviewerData?.getTaskReviewers?.length)}
        reviewerData={reviewerData}
        canEdit={canEdit}
        fetchedTask={fetchedTask}
        user={user}
      />
      <AssigneeField
        boardColumns={boardColumns}
        canApply={canApply}
        canClaim={canClaim}
        canEdit={canEdit}
        fetchedTask={fetchedTask}
        isTaskProposal={isTaskProposal}
        orgId={board?.orgId}
        podId={board?.podId}
        shouldDisplay={showAssignee}
        updateProposalItem={updateProposalItem}
        user={user}
        userId={board?.userId}
      />
      {!isViewNft && <WatchersField fetchedTask={fetchedTask} />}

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
        shouldDisplay={entityTypeData[entityType].fields.includes(Fields.dueDate) && (canEdit || fetchedTask?.dueDate)}
        canEdit={canEdit}
        dueDate={fetchedTask?.dueDate}
        recurringSchema={fetchedTask?.recurringSchema}
        shouldUnclaimOnDueDateExpiry={fetchedTask?.shouldUnclaimOnDueDateExpiry}
      />
      <RewardsField
        fetchedTask={fetchedTask}
        canEdit={canEdit}
        shouldDisplay={
          entityTypeData[entityType].fields.includes(Fields.reward) && (canEdit || fetchedTask?.rewards?.length)
        }
      />
      <PointsField
        shouldDisplay={entityTypeData[entityType].fields.includes(Fields.points) && (canEdit || fetchedTask?.points)}
        points={fetchedTask?.points}
        canEdit={canEdit}
      />
      <MilestoneField
        shouldDisplay={
          entityTypeData[entityType].fields.includes(Fields.milestone) && (canEdit || fetchedTask?.milestoneId)
        }
        milestoneId={fetchedTask?.milestoneId}
        getTaskById={getTaskById}
        canEdit={canEdit}
        isSubtask={isSubtask}
        orgId={fetchedTask?.orgId}
        podId={fetchedTask?.podId}
        milestoneTitle={fetchedTask?.milestone?.title || fetchedTask?.milestoneTitle}
      />
      <PriorityField
        priority={fetchedTask?.priority}
        canEdit={canEdit}
        shouldDisplay={
          entityTypeData[entityType].fields.includes(Fields.priority) && (canEdit || fetchedTask?.priority)
        }
      />
      <CategoryField
        labels={remaininTaskCategories}
        canEdit={canEdit}
        shouldDisplay={
          !!(canEdit || fetchedTask?.categories?.length) && entityTypeData[entityType].fields.includes(Fields.categories)
        }
      />
      <TagsField
        canEdit={canEdit}
        shouldDisplay={
          entityTypeData[entityType].fields.includes(Fields.tags) && (canEdit || fetchedTask?.labels?.length)
        }
        labels={fetchedTask?.labels}
        orgId={fetchedTask?.orgId}
      />
      <InitiativesField shouldDisplay={hasGR15DEIIntiative(fetchedTask?.categories)} />
    </>
  );
};

export default ModalFields;
