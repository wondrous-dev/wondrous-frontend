import { useMutation } from '@apollo/client';
import Grid from '@mui/material/Grid';
import StrictModeDroppable from 'components/StrictModeDroppable';
import { UPSERT_ORG_PROFILE_PAGE, UPSERT_POD_PROFILE_PAGE } from 'graphql/mutations';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';

import palette from 'theme/palette';
import ProfileBountySection from './ProfileBountySection';
import ProfileCategorySection from './ProfileCategorySection';
import ProfileCollabSection from './ProfileCollabSection';
import ProfileGrantSection from './ProfileGrantSection';
import ProfileMemberSection from './ProfileMemberSection';
import ProfileMilestoneSection from './ProfileMilestoneSection';
import ProfileProposalSection from './ProfileProposalSection';
import ProfileTaskSection from './ProfileTaskSection';

const ProfileSectionsWrapper = ({ layout, orgId }) => {
  const [upsertOrgProfilePage] = useMutation(UPSERT_ORG_PROFILE_PAGE, {
    refetchQueries: ['getOrgFromUsername'],
  });

  // TODO: Not used yet
  // const [upsertPodProfilePage] = useMutation(UPSERT_POD_PROFILE_PAGE);

  const upsert = (newOrder) => {
    if (orgId) {
      upsertOrgProfilePage({
        variables: {
          input: {
            orgId,
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
    collab: ProfileCollabSection,
    grant: ProfileGrantSection,
    resource: ProfileCategorySection,
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId="droppableId">
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
              const Component = Components[order];
              return (
                <Draggable key={index} draggableId={`${index}`} index={index}>
                  {(provided, snapshot) => (
                    <Grid
                      container
                      item
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
                    </Grid>
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
