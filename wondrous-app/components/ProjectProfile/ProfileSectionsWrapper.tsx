import { useMutation } from '@apollo/client';
import Grid from '@mui/material/Grid';
import StrictModeDroppable from 'components/StrictModeDroppable';
import { UPSERT_ORG_PROFILE_PAGE, UPSERT_POD_PROFILE_PAGE } from 'graphql/mutations';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';

import palette from 'theme/palette';
import { ONLY_GRANTS_ENABLED_ORGS, PERMISSIONS } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
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
  const { orgId, podId, orgData, pod } = useBoards().board || {};
  const { layout } = (podId ? pod : orgData) || {};
  const isOrg = useIsOrg();
  const { hasFullPermission } = useBoardPermission();
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

  const isMeritCircle = ONLY_GRANTS_ENABLED_ORGS.includes(orgId);
  const Components = isMeritCircle
    ? {
        grant: ProfileGrantSection,
        member: ProfileMemberSection,
        resource: ProfileCategorySection,
        ...(isOrg && { collab: ProfileCollabSection }),
      }
    : {
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
      <StrictModeDroppable droppableId="droppableId" isDragDisabled={!hasFullPermission}>
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
              if (!Components[order]) return null;
              const Component = Components[order];
              return (
                <Draggable key={index} draggableId={`${index}`} index={index} isDragDisabled={!hasFullPermission}>
                  {(provided, snapshot) => (
                    <CardWrapper
                      container
                      item
                      hasFullAccess={hasFullPermission}
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
