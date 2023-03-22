import { useQuery } from '@apollo/client';
import { Add } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';
import { ItemButtonIcon } from 'components/Common/SidebarItem/styles';
import TrashIcon from 'components/Common/WonderAiTaskGeneration/images/trash-icon.svg';
import PlusIcon, { AddIcon } from 'components/Icons/plus';

import { GET_ORG_PODS } from 'graphql/queries';
import palette from 'theme/palette';
import typography from 'theme/typography';

import { AddProposalButtonContainer, AddProposalButtonContainerText } from 'components/Common/ProposalBoard/styles';
import ChooseEntityToCreate from 'components/CreateEntity';
import EditIcon from 'components/Icons/editIcon';
import { useMemo, useState } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
import { useGlobalContext } from 'utils/hooks';
import { ButtonsPanel } from '../Shared';
import useProjectOnboardingContext from '../Shared/context';
import { ActionItemWrapper, PageLabel } from '../Shared/styles';

const TYPES = {
  ADD: 'ADD',
  SUGGESTIONS: 'SUGGESTIONS',
  EMPTY: 'EMPTY',
};

const Actions = ({ type, entityType }) => {
  if (type === TYPES.ADD) {
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
  if (false) {
    return (
      <ActionItemWrapper type="button">
        <TrashIcon />
      </ActionItemWrapper>
    );
  }
  return (
    <Grid display="flex" gap="8px" alignItems="center">
      <ActionItemWrapper type="button">
        <EditIcon />
      </ActionItemWrapper>
      <ActionItemWrapper type="button">
        <TrashIcon />
      </ActionItemWrapper>
    </Grid>
  );
};

const CardType = ({ type, entityType, title = null, podColor = null }) => (
  <Grid
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    padding="10px 4px 10px 8px"
    bgcolor={palette.grey85}
    width="100%"
    borderRadius="6px"
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
    {type !== TYPES.EMPTY ? <Actions type={type} entityType={entityType} /> : null}
  </Grid>
);

const PODS = {
  [TYPES.ADD]: [
    {
      title: 'Content pod',
    },
    {
      title: 'Marketing pod',
    },
    {
      title: 'Design pod',
    },
  ],
  [TYPES.SUGGESTIONS]: [
    {
      title: 'Suggested content pod',
    },
    {
      title: 'Marketing pod',
    },
  ],
};

const TASKS = {
  [TYPES.ADD]: [],
  [TYPES.SUGGESTIONS]: [],
};

const MILESTONES = {
  [TYPES.ADD]: [],
  [TYPES.SUGGESTIONS]: [],
};

const BOUNTIES = {
  [TYPES.ADD]: [],
  [TYPES.SUGGESTIONS]: [],
};

const AddEntity = ({ entityType, nextStep }) => {
  const { setPageData } = useGlobalContext();

  const { orgId } = useProjectOnboardingContext();
  const { data: orgPodsData } = useQuery(GET_ORG_PODS, {
    variables: {
      orgId,
    },
    skip: entityType !== ENTITIES_TYPES.POD,
  });

  const openCreateEntityModal = () => setPageData((prev) => ({ ...prev, createEntityType: entityType }));

  const items = useMemo(() => {
    if (entityType === ENTITIES_TYPES.POD) return PODS;
    if (entityType === ENTITIES_TYPES.TASK) return TASKS;
    if (entityType === ENTITIES_TYPES.MILESTONE) return MILESTONES;
    if (entityType === ENTITIES_TYPES.BOUNTY) return BOUNTIES;
  }, [entityType]);

  const addItems = items[TYPES.ADD];

  const suggestionItems = items[TYPES.SUGGESTIONS];

  return (
    <>
      <ChooseEntityToCreate />
      <Grid height="100%" justifyContent="space-between" container direction="column">
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
                addItems.map((item) => <CardType type={TYPES.ADD} entityType={entityType} {...item} />)
              ) : (
                <CardType type={TYPES.EMPTY} entityType={entityType} />
              )}
            </Grid>
            <Grid display="flex" flexDirection="column" gap="8px" width="100%">
              <PageLabel fontSize="13px">Suggested {entityType}s</PageLabel>
              {suggestionItems.map((item) => (
                <CardType type={TYPES.SUGGESTIONS} entityType={entityType} {...item} />
              ))}
            </Grid>
          </Grid>
        </Grid>
        <ButtonsPanel onContinue={nextStep} onSkip={nextStep} />
      </Grid>
    </>
  );
};

export default AddEntity;
