import { useMutation } from '@apollo/client';
import Grid from '@mui/material/Grid';
import StrictModeDroppable from 'components/StrictModeDroppable';
import { UPSERT_ORG_PROFILE_PAGE, UPSERT_POD_PROFILE_PAGE } from 'graphql/mutations';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';

import palette from 'theme/palette';
import { useBoardPermission, useBoards } from 'utils/hooks';
import { useIsOrg } from './helpers';
import ProfileBountySection from './ProfileBountySection';
import ProfileCategorySection from './ProfileCategorySection';
import ProfileCollabSection from './ProfileCollabSection';
import ProfileGrantSection from './ProfileGrantSection';
import ProfileMemberSection from './ProfileMemberSection';
import ProfileMilestoneSection from './ProfileMilestoneSection';
import ProfileProposalSection from './ProfileProposalSection';
import ProfileTaskSection from './ProfileTaskSection';
import { CardWrapper } from './styles';

const ProfileSectionsWrapper = () => {
  const { orgId, podId, projectData } = useBoards().board || {};
  const { layout } = projectData || {};
  const isOrg = useIsOrg();
  const { hasFullOrEditPermission } = useBoardPermission();
  const [upsertOrgProfilePage] = useMutation(UPSERT_ORG_PROFILE_PAGE, {
    refetchQueries: ['getOrgFromUsername'],
  });
  const [upsertPodProfilePage] = useMutation(UPSERT_POD_PROFILE_PAGE, {
    refetchQueries: ['getPodById'],
  });

  const upsert = (newOrder) => {
    if (isOrg) {
      upsertOrgProfilePage({
        variables: {
          input: {
            orgId,
            layout: newOrder,
          },
        },
      });
    }
    if (!isOrg) {
      upsertPodProfilePage({
        variables: {
          input: {
            podId,
            layout: newOrder,
          },
        },
      });
    }
  };

  const onDragEnd = (result) => {
    const orderClone = [...layout];
    const [removed] = orderClone.splice(result.source.index, 1);
    orderClone.splice(result.destination.index, 0, removed);
    return upsert(orderClone);
  };

  if (!layout) return null;

  const Components = {
    task: ProfileTaskSection,
    bounty: ProfileBountySection,
    milestone: ProfileMilestoneSection,
    proposal: ProfileProposalSection,
    member: ProfileMemberSection,
    grant: ProfileGrantSection,
    resource: ProfileCategorySection,
    ...(isOrg && { collab: ProfileCollabSection }),
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId="droppableId" isDragDisabled={!hasFullOrEditPermission}>
        {(provided) => (
          <Grid
            container
            justifyContent="space-between"
            gap="24px"
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              '& > *': {
                maxWidth: 'calc(50% - 12px)',
              },
            }}
          >
            {layout?.map((order, index) => {
              const Component = Components?.[order];
              if (!Component) return null;
              return (
                <Draggable key={index} draggableId={`${index}`} index={index} isDragDisabled={!hasFullOrEditPermission}>
                  {(provided, snapshot) => (
                    <CardWrapper
                      container
                      item
                      hasFullAccess={hasFullOrEditPermission}
                      flexDirection="column"
                      justifyContent="space-between"
                      height="390px"
                      bgcolor={palette.grey900}
                      borderRadius="6px"
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      isDragging={snapshot.isDragging}
                    >
                      <Component key={index} />
                    </CardWrapper>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </Grid>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
};

export default ProfileSectionsWrapper;
