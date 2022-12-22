import Grid from '@mui/material/Grid';
import StrictModeDroppable from 'components/StrictModeDroppable';

import { DragDropContext, Draggable } from 'react-beautiful-dnd';

import ProfileBountySection from './ProfileBountySection';
import ProfileCategorySection from './ProfileCategorySection';
import ProfileCollabSection from './ProfileCollabSection';
import ProfileGrantSection from './ProfileGrantSection';
import ProfileMemberSection from './ProfileMemberSection';
import ProfileMilestoneSection from './ProfileMilestoneSection';
import ProfileProposalSection from './ProfileProposalSection';
import ProfileTaskSection from './ProfileTaskSection';

const ProfileSectionsWrapper = () => {
  const onDragEnd = () => console.log('on drag end');

  const onDragStart = () => console.log('on drag start');

  const Components = [
    ProfileTaskSection,
    ProfileBountySection,
    ProfileMilestoneSection,
    ProfileProposalSection,
    ProfileMemberSection,
    ProfileCollabSection,
    ProfileGrantSection,
    ProfileCategorySection,
  ];
  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
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
            {Components.map((Component, index) => (
              <Draggable key={index} draggableId={`${index}`} index={index}>
                {(provided, snapshot) => (
                  <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    isDragging={snapshot.isDragging}
                  >
                    <Component key={index} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Grid>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
};

export default ProfileSectionsWrapper;
