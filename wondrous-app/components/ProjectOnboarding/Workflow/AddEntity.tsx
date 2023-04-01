import { useQuery } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';
import { ItemButtonIcon } from 'components/Common/SidebarItem/styles';
import TrashIcon from 'components/Common/WonderAiTaskGeneration/images/trash-icon.svg';
import { AddIcon } from 'components/Icons/plus';

import { GET_ORG_PODS } from 'graphql/queries';
import palette from 'theme/palette';
import typography from 'theme/typography';

import { useMe } from 'components/Auth/withAuth';
import DeleteEntityModal from 'components/Common/DeleteEntityModal';
import { AddProposalButtonContainer, AddProposalButtonContainerText } from 'components/Common/ProposalBoard/styles';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import ChooseEntityToCreate, { CreateEntity } from 'components/CreateEntity';
import EditIcon from 'components/Icons/editIcon';
import { UnstyledLink } from 'components/WorkspacePicker/styles';
import { GET_ORG_HOME_MILESTONES, GET_ORG_HOME_TASK_OBJECTS } from 'graphql/queries/projectPage';
import { useRouter } from 'next/router';
import { useContext, useMemo, useState } from 'react';
import { ANALYTIC_EVENTS, ENTITIES_TYPES } from 'utils/constants';
import { useGlobalContext, useOrgBoard } from 'utils/hooks';
import { ButtonsPanel, sendAnalyticsData } from '../Shared';
import { ActionItemWrapper, PageLabel } from '../Shared/styles';
import { TASK_SUGGESTIONS } from './constants';

const TYPES = {
  ADD: 'ADD',
  SUGGESTIONS: 'SUGGESTIONS',
  EMPTY: 'EMPTY',
};

const Actions = ({ type, entityType, onEdit, onDelete, onAdd }) => {
  if (entityType === ENTITIES_TYPES.POD && type === TYPES.ADD) {
    return null;
  }
  if (type === TYPES.SUGGESTIONS) {
    return (
      <ItemButtonIcon
        onClick={onAdd}
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

const CardType = ({
  type,
  entityType,
  title = null,
  podColor = null,
  id = null,
  onEdit = null,
  onDelete = null,
  onAdd = null,
}) => {
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
  const CardItemWrapper = id ? UnstyledLink : 'div';

  const CardItemAddProps = type === TYPES.SUGGESTIONS ? { onClick: onAdd } : {};
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
      <CardItemWrapper
        href={link}
        style={{
          flexGrow: '1',
        }}
        {...CardItemAddProps}
      >
        <Grid display="flex" gap="8px" alignItems="center">
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
      </CardItemWrapper>
      {type !== TYPES.EMPTY ? (
        <Actions type={type} entityType={entityType} onEdit={onEdit} onDelete={onDelete} onAdd={onAdd} />
      ) : null}
    </Grid>
  );
};

const AddEntity = ({ entityType, nextStep }) => {
  const { setPageData } = useGlobalContext();
  const user = useMe();
  const { orgData } = useOrgBoard();
  const [defaultData, setDefaultData] = useState(null);
  const { setSnackbarAlertOpen, setSnackbarAlertMessage, setSnackbarAlertSeverity } = useContext(SnackbarAlertContext);

  const [editTask, setEditTask] = useState(null);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const { data: orgMilestones } = useQuery(GET_ORG_HOME_MILESTONES, {
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
  }, [
    entityType,
    orgPodsData?.getOrgPods,
    orgTasksData?.getOrgHomeTaskObjects,
    orgMilestones?.getOrgHomeMilestones,
    orgData?.category,
  ]);

  const suggestionsCategory = TASK_SUGGESTIONS[orgData?.category] || TASK_SUGGESTIONS.DEFAULT;

  const addItems = items[TYPES.ADD];
  const suggestions = suggestionsCategory[entityType];

  const getEntityTypeEvent = () => {
    switch (entityType) {
      case ENTITIES_TYPES.POD:
        return ANALYTIC_EVENTS.ONBOARDING_POD_CREATE;
      case ENTITIES_TYPES.TASK:
        return ANALYTIC_EVENTS.ONBOARDING_TASK_CREATE;
      case ENTITIES_TYPES.MILESTONE:
        return ANALYTIC_EVENTS.ONBOARDING_MILESTONE_CREATE;
      case ENTITIES_TYPES.BOUNTY:
        return ANALYTIC_EVENTS.ONBOARDING_BOUNTY_CREATE;
    }
  };

  const handlePostEntityCreate = () => {
    const entityEvent = getEntityTypeEvent();
    sendAnalyticsData(entityEvent, {
      orgId: orgData?.orgId,
      userId: user?.id,
    });
    return setPageData((prev) => ({ ...prev, createEntityType: null }));
  };

  console.log(defaultData, 'DEF DATA');
  return (
    <>
      <ChooseEntityToCreate shouldRedirect={false} handleClose={handlePostEntityCreate} defaults={defaultData} />
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
              onClick={openCreateEntityModal}
              style={{
                justifyContent: 'flex-start',
                padding: '14px 16px 14px 5px',
                maxHeight: '40px',
                width: 'fit-content',
              }}
            >
              <AddIcon />
              <AddProposalButtonContainerText textTransform="capitalize">
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
            <Grid display="flex" flexDirection="column" gap="8px" width="100%">
              <PageLabel fontSize="13px">Suggestions</PageLabel>
              {suggestions?.length ? (
                suggestions.map((item) => (
                  <CardType
                    type={TYPES.SUGGESTIONS}
                    entityType={entityType}
                    title={item?.title}
                    id={item?.id}
                    onAdd={() => {
                      setDefaultData(item);
                      openCreateEntityModal();
                    }}
                  />
                ))
              ) : (
                <CardType type={TYPES.EMPTY} entityType={entityType} />
              )}
            </Grid>
          </Grid>
        </Grid>
        <ButtonsPanel onContinue={nextStep} onSkip={nextStep} />
      </Grid>
    </>
  );
};

export default AddEntity;
