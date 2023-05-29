import { useMutation } from '@apollo/client';
import Grid from '@mui/material/Grid';
import StrictModeDroppable from 'components/StrictModeDroppable';
import { UPSERT_ORG_PROFILE_PAGE, UPSERT_POD_PROFILE_PAGE } from 'graphql/mutations';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';

import useMediaQuery from '@mui/material/useMediaQuery';
import useQueryModules from 'hooks/modules/useQueryModules';
import palette from 'theme/palette';
import { useBoardPermission, useBoards } from 'utils/hooks';
import theme from '../../theme';
import ProfileBountySection from './ProfileBountySection';
import ProfileCategorySection from './ProfileCategorySection';
import ProfileCollabSection from './ProfileCollabSection';
import ProfileGrantSection from './ProfileGrantSection';
import ProfileMemberSection from './ProfileMemberSection';
import ProfileMilestoneSection from './ProfileMilestoneSection';
import ProfileProposalSection from './ProfileProposalSection';
import ProfileTaskSection from './ProfileTaskSection';
import ProjectProfileAddFeatures from './ProjectProfileAddFeatures';
import { useIsOrg } from './helpers';
import { CardWrapper } from './styles';

const ProfileSectionsWrapper = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { orgId, podId, orgData, pod } = useBoards().board || {};
  const { layout } = (podId ? pod : orgData) || {};
  const isOrg = useIsOrg();
  const { hasFullPermission } = useBoardPermission();
  const modules = useQueryModules({ orgId, podId });
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

  if (!layout || !modules) return null;

  const Components = {
    ...(modules?.task && {
      task: ProfileTaskSection,
    }),
    ...(modules?.bounty && {
      bounty: ProfileBountySection,
    }),
    ...(modules?.milestone && {
      milestone: ProfileMilestoneSection,
    }),
    ...(modules?.proposal && {
      proposal: ProfileProposalSection,
    }),
    member: ProfileMemberSection,
    ...(modules?.grant && {
      grant: ProfileGrantSection,
    }),
    ...(modules?.document && { resource: ProfileCategorySection }),
    ...(isOrg && modules?.collab && { collab: ProfileCollabSection }),
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
                maxWidth: isMobile ? 'unset' : 'calc(50% - 12px)',
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
                      minWidth="238px"
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
            {hasFullPermission && <ProjectProfileAddFeatures orgId={orgId} podId={podId} />}
          </Grid>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
};

export default ProfileSectionsWrapper;
