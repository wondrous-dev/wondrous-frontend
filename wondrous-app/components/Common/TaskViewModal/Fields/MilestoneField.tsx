import { useLazyQuery } from '@apollo/client';
import Grid from '@mui/material/Grid';
import { filterUserOptions, useGetMilestones } from 'components/CreateEntity/CreateEntityModal/Helpers';
import MilestoneSearch from 'components/CreateEntity/CreateEntityModal/MilestoneSearch';
import { CreateEntityError } from 'components/CreateEntity/CreateEntityModal/styles';
import EditIcon from 'components/Icons/editIcon';
import { GET_MILESTONE_BY_ID } from 'graphql/queries';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import palette from 'theme/palette';
import { TaskSectionLabel } from '../helpers';
import {
  TaskSectionDisplayDiv,
  TaskSectionInfoMilestoneIcon,
  TaskSectionInfoTextMilestone,
  ViewFieldWrapper,
} from '../styles';
import { FIELDS } from './hooks/constants';
import { useSubmit } from './hooks/useSubmit';
import { TaskFieldEditableContent } from './Shared';
import { IconWrapper } from './styles';

const MilestoneFieldContent = ({ milestoneId, milestoneTitle, canEdit, toggleEditMode }) => {
  const router = useRouter();

  const link = useMemo(() => {
    const query: any = {
      ...router.query,
      milestone: milestoneId,
    };

    delete query.task;

    return {
      pathname: router.pathname,
      query,
    };
  }, [router, milestoneId]);

  return (
    <ViewFieldWrapper $canEdit={canEdit} onClick={toggleEditMode}>
      <Grid
        display="flex"
        gap="8px"
        alignItems="center"
        justifyContent="center"
        sx={{
          overflowWrap: 'anywhere',
        }}
      >
        <Link href={link}>
          <IconWrapper>
            <TaskSectionInfoMilestoneIcon />
          </IconWrapper>
        </Link>
        <TaskSectionInfoTextMilestone
          sx={{
            display: 'inline-block !important',
            whiteSpace: 'pre-line !important',
          }}
        >
          {milestoneTitle}
        </TaskSectionInfoTextMilestone>
      </Grid>
      <EditIcon stroke={palette.grey58} className="edit-icon-field" />
    </ViewFieldWrapper>
  );
};

const EditMode = ({ orgId, podId, milestoneId, toggleEditMode, toggleOutsideAlerter }) => {
  const milestonesData = useGetMilestones(orgId, podId);
  const { submit, error } = useSubmit({ field: FIELDS.MILESTONE });

  return (
    <Grid display="flex" direction="column" gap="4px">
      <MilestoneSearch
        autoFocus
        options={filterUserOptions(milestonesData)}
        value={milestoneId}
        onChange={async (milestoneId) => {
          await submit(milestoneId);
          toggleEditMode();
        }}
        onNewMilestoneClick={toggleOutsideAlerter}
        handleClose={async () => {
          toggleEditMode();
          await submit(null);
        }}
      />
      {error ? <CreateEntityError>{error}</CreateEntityError> : null}
    </Grid>
  );
};

const MilestoneField = ({ shouldDisplay, milestoneId, milestoneTitle, canEdit, isSubtask, orgId, podId }) => {
  if (!shouldDisplay) return null;

  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Milestone</TaskSectionLabel>
      <TaskFieldEditableContent
        viewContent={({ toggleEditMode }) => (
          <MilestoneFieldContent
            milestoneId={milestoneId}
            milestoneTitle={milestoneTitle}
            toggleEditMode={toggleEditMode}
            canEdit={canEdit && !isSubtask}
          />
        )}
        addContent={({ toggleAddMode, toggleOutsideAlerter }) => (
          <EditMode
            toggleOutsideAlerter={toggleOutsideAlerter}
            orgId={orgId}
            podId={podId}
            milestoneId={milestoneId}
            toggleEditMode={toggleAddMode}
          />
        )}
        canAddItem={canEdit && !milestoneId}
        editableContent={({ toggleEditMode, toggleOutsideAlerter }) => (
          <EditMode
            toggleOutsideAlerter={toggleOutsideAlerter}
            orgId={orgId}
            podId={podId}
            milestoneId={milestoneId}
            toggleEditMode={toggleEditMode}
          />
        )}
      />
    </TaskSectionDisplayDiv>
  );
};

export default MilestoneField;
