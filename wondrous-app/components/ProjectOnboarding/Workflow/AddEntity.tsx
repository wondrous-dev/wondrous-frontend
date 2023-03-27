import { useQuery } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';
import { ItemButtonIcon } from 'components/Common/SidebarItem/styles';
import TrashIcon from 'components/Common/WonderAiTaskGeneration/images/trash-icon.svg';
import { AddIcon } from 'components/Icons/plus';

import { GET_ORG_PODS } from 'graphql/queries';
import palette from 'theme/palette';
import typography from 'theme/typography';

import DeleteEntityModal from 'components/Common/DeleteEntityModal';
import { AddProposalButtonContainer, AddProposalButtonContainerText } from 'components/Common/ProposalBoard/styles';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import ChooseEntityToCreate, { CreateEntity } from 'components/CreateEntity';
import EditIcon from 'components/Icons/editIcon';
import { UnstyledLink } from 'components/WorkspacePicker/styles';
import { GET_ORG_HOME_MILESTONS, GET_ORG_HOME_TASK_OBJECTS } from 'graphql/queries/projectPage';
import { useRouter } from 'next/router';
import { useContext, useMemo, useState } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
import { useGlobalContext, useOrgBoard } from 'utils/hooks';
import { ButtonsPanel } from '../Shared';
import { ActionItemWrapper, PageLabel } from '../Shared/styles';

const TYPES = {
  ADD: 'ADD',
  SUGGESTIONS: 'SUGGESTIONS',
  EMPTY: 'EMPTY',
};

const Actions = ({ type, entityType, onEdit, onDelete }) => {
  if (entityType === ENTITIES_TYPES.POD) {
    return null;
  }
  if (type === TYPES.SUGGESTIONS) {
    return (
      <ItemButtonIcon
        bgColor={palette.grey940}
        style={{
          height: '26px',
          width: '26px',
        }}
      >
        <Add
          fill={palette.white}
          sx={{
            fill: palette.blue20,
            path: {
              stroke: 'transparent !important',
            },
          }}
        />
      </ItemButtonIcon>
    );
  }
  return (
    <Grid display="flex" gap="8px" alignItems="center">
      <ActionItemWrapper type="button" onClick={onEdit}>
        <EditIcon />
      </ActionItemWrapper>
      <ActionItemWrapper type="button" onClick={onDelete}>
        <TrashIcon />
      </ActionItemWrapper>
    </Grid>
  );
};

const CardType = ({ type, entityType, title = null, podColor = null, id = null, onEdit = null, onDelete = null }) => {
  const router = useRouter();

  const link =
    entityType === ENTITIES_TYPES.POD
      ? `/pod/${id}/boards`
      : {
          pathname: router.pathname,
          query: {
            ...router.query,
            ...(entityType === ENTITIES_TYPES.MILESTONE ? { milestone: id } : { task: id }),
          },
        };

  return (
    <Grid
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      padding="10px 4px 10px 8px"
      bgcolor={palette.grey85}
      width="100%"
      sx={{
        cursor: 'pointer',
        pointerEvents: title ? 'all' : 'none',
        '&:hover': {
          backgroundColor: palette.grey78,
        },
      }}
      borderRadius="6px"
    >
      <UnstyledLink
        href={link}
        style={{
          flexGrow: '1',
        }}
      >
        <Grid display="flex" gap="8px">
          {entityType === ENTITIES_TYPES.POD ? (
            <Grid bgcolor={podColor || palette.highlightPurple} width="10px" height="10px" borderRadius="110px" />
          ) : null}
          <Typography
            color={palette.white}
            fontSize="13px"
            lineHeight="13px"
            fontFamily={typography.fontFamily}
            fontWeight={700}
          >
            {title || 'None added yet'}
          </Typography>
        </Grid>
      </UnstyledLink>
      {type !== TYPES.EMPTY ? (
        <Actions type={type} entityType={entityType} onEdit={onEdit} onDelete={onDelete} />
      ) : null}
    </Grid>
  );
};

const AddEntity = ({ entityType, nextStep }) => {
  const { setPageData } = useGlobalContext();
  const { orgData } = useOrgBoard();
  const { setSnackbarAlertOpen, setSnackbarAlertMessage, setSnackbarAlertSeverity } = useContext(SnackbarAlertContext);

  const [editTask, setEditTask] = useState(null);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const { data: orgMilestones } = useQuery(GET_ORG_HOME_MILESTONS, {
    variables: {
      input: {
        orgId: orgData?.orgId,
        limit: 5,
      },
    },
    skip: entityType !== ENTITIES_TYPES.MILESTONE || !orgData?.orgId,
  });
  const { data: orgPodsData } = useQuery(GET_ORG_PODS, {
    variables: {
      orgId: orgData?.orgId,
    },
    skip: entityType !== ENTITIES_TYPES.POD || !orgData?.orgId,
  });

  const { data: orgTasksData } = useQuery(GET_ORG_HOME_TASK_OBJECTS, {
    variables: {
      input: {
        orgId: orgData?.orgId,
        limit: 5,
      },
    },
    skip: !orgData?.orgId || ![ENTITIES_TYPES.TASK, ENTITIES_TYPES.BOUNTY].includes(entityType),
  });

  const openCreateEntityModal = () => setPageData((prev) => ({ ...prev, createEntityType: entityType }));

  const items = useMemo(() => {
    if (entityType === ENTITIES_TYPES.POD)
      return {
        [TYPES.ADD]: orgPodsData?.getOrgPods?.map((pod) => ({ title: pod.name, podColor: pod.color, id: pod.id })),
      };
    if (entityType === ENTITIES_TYPES.TASK)
      return {
        [TYPES.ADD]: orgTasksData?.getOrgHomeTaskObjects?.tasks,
      };
    if (entityType === ENTITIES_TYPES.MILESTONE)
      return {
        [TYPES.ADD]: orgMilestones?.getOrgHomeMilestones,
      };
    if (entityType === ENTITIES_TYPES.BOUNTY)
      return {
        [TYPES.ADD]: orgTasksData?.getOrgHomeTaskObjects?.bounties,
      };
  }, [entityType, orgPodsData?.getOrgPods, orgTasksData?.getOrgHomeTaskObjects, orgMilestones?.getOrgHomeMilestones]);

  const addItems = items[TYPES.ADD];
  return (
    <>
      <ChooseEntityToCreate />
      {editTask ? (
        <CreateEntity
          open={editTask}
          handleCloseModal={() => {
            setEditTask(false);
          }}
          entityType={entityType}
          handleClose={() => {
            setEditTask(false);
          }}
          cancel={() => setEditTask(false)}
          existingTask={editTask}
        />
      ) : null}
      {deleteTaskId ? (
        <DeleteEntityModal
          open
          onClose={() => setDeleteTaskId(false)}
          entityType={entityType}
          taskId={deleteTaskId}
          onDelete={() => {
            setSnackbarAlertOpen(true);
            setSnackbarAlertMessage(`Deleted successfully!`);
          }}
        />
      ) : null}

      <Grid height="100%" justifyContent="space-between" container direction="column" gap="42px">
        <Grid container direction="column" gap="24px">
          <Grid
            width={{
              xs: '100%',
              md: 'fit-content',
            }}
          >
            <AddProposalButtonContainer
              onClick={() => {}}
              style={{
                justifyContent: 'flex-start',
                padding: '14px 16px 14px 5px',
                maxHeight: '40px',
                width: 'fit-content',
              }}
            >
              <AddIcon />
              <AddProposalButtonContainerText textTransform="capitalize" onClick={openCreateEntityModal}>
                Create {entityType}
              </AddProposalButtonContainerText>
            </AddProposalButtonContainer>
          </Grid>

          <Grid container direction="column" gap="24px" alignItems="flex-start">
            <Grid display="flex" flexDirection="column" gap="8px" width="100%">
              <PageLabel fontSize="13px">Added</PageLabel>
              {addItems?.length ? (
                addItems.map((item) => (
                  <CardType
                    type={TYPES.ADD}
                    entityType={entityType}
                    onEdit={() => setEditTask(item)}
                    title={item?.title}
                    onDelete={() => setDeleteTaskId(item?.id)}
                    id={item?.id}
                    podColor={item?.podColor}
                  />
                ))
              ) : (
                <CardType type={TYPES.EMPTY} entityType={entityType} />
              )}
            </Grid>
            {/* <Grid display="flex" flexDirection="column" gap="8px" width="100%">
              <PageLabel fontSize="13px">Suggested {entityType}s</PageLabel>
              {suggestionItems.map((item) => (
                <CardType type={TYPES.SUGGESTIONS} entityType={entityType} {...item} />
              ))}
            </Grid> */}
          </Grid>
        </Grid>
        <ButtonsPanel onContinue={nextStep} onSkip={nextStep} />
      </Grid>
    </>
  );
};

export default AddEntity;
