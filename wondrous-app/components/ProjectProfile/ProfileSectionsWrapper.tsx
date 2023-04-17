import { useMutation } from '@apollo/client';
import Grid from '@mui/material/Grid';
import StrictModeDroppable from 'components/StrictModeDroppable';
import { UPSERT_ORG_PROFILE_PAGE, UPSERT_POD_PROFILE_PAGE } from 'graphql/mutations';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';

import palette from 'theme/palette';
import { ENTITIES_TYPES, SPECIAL_ORGS } from 'utils/constants';
import { useBoardPermission, useBoards } from 'utils/hooks';
import useMediaQuery from '@mui/material/useMediaQuery';
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
import theme from '../../theme';

const ProfileSectionsWrapper = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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

  const isSpecialOrg = orgId in SPECIAL_ORGS;
  const Components = {
    ...(!isSpecialOrg ||
      (SPECIAL_ORGS[orgId].includes(ENTITIES_TYPES.TASK) &&
        ({
          task: ProfileTaskSection,
        } as {}))),
    ...(!isSpecialOrg ||
      (SPECIAL_ORGS[orgId].includes(ENTITIES_TYPES.BOUNTY) &&
        ({
          bounty: ProfileBountySection,
        } as {}))),
    ...(!isSpecialOrg ||
      (SPECIAL_ORGS[orgId].includes(ENTITIES_TYPES.MILESTONE) &&
        ({
          milestone: ProfileMilestoneSection,
        } as {}))),
    ...(!isSpecialOrg ||
      (SPECIAL_ORGS[orgId].includes(ENTITIES_TYPES.PROPOSAL) &&
        ({
          proposal: ProfileProposalSection,
        } as {}))),
    member: ProfileMemberSection,
    ...(!isSpecialOrg ||
      (SPECIAL_ORGS[orgId].includes(ENTITIES_TYPES.GRANT) &&
        ({
          grant: ProfileGrantSection,
        } as {}))),
    resource: ProfileCategorySection,
    ...(isOrg &&
      (!isSpecialOrg || SPECIAL_ORGS[orgId].includes(ENTITIES_TYPES.COLLAB)) && { collab: ProfileCollabSection }),
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
          </Grid>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
};

export default ProfileSectionsWrapper;
