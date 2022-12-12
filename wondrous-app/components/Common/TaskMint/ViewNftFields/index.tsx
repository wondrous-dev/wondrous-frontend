import { Grid, Typography } from '@mui/material';
import { TaskSectionImageContent, TaskSectionLabel } from 'components/Common/TaskViewModal/helpers';
import { InfoPoint, TaskSectionDisplayDiv, TaskSectionInfoCalendar } from 'components/Common/TaskViewModal/styles';
import { Polygon } from 'components/Icons/chains';
import { windowOffset } from 'components/Table/constants';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import palette from 'theme/palette';
import { ENTITIES_TYPES } from 'utils/constants';
import { cutString } from 'utils/helpers';
import { delQuery } from 'utils/index';
import { PolygonIconWrapper, TaskLink } from './styles';

const FIELDS = [
  {
    label: 'Chain',
    Component: () => (
      <Grid display="flex" gap="12px" alignItems="center">
        <PolygonIconWrapper>
          <Polygon />
        </PolygonIconWrapper>
        <Typography color={palette.white} fontFamily="inherit" fontSize="13px" fontWeight={500}>
          Polygon
        </Typography>
      </Grid>
    ),
  },
  {
    label: 'Task',
    Component: ({ taskId, title, onClose }) => {
      const router = useRouter();

      const url = useMemo(
        () =>
          `${delQuery(router.asPath)}?task=${taskId}&view=${router.query.view || 'grid'}&entity=${
            router?.query?.entity || ENTITIES_TYPES.TASK
          }`,
        [router?.query?.entity, router?.asPath, router?.query?.view, taskId]
      );

      const onClick = (e) => {
        e.preventDefault();
        onClose();
      };

      return (
        <TaskLink onClick={onClick} href={url}>
          {cutString(title, 20)}
        </TaskLink>
      );
    },
  },
];

export default function ViewNftFields({ taskId, taskTitle, onClose }) {
  return (
    <>
      {FIELDS.map(({ label, Component }, idx) => (
        <TaskSectionDisplayDiv key={`${taskId}_${idx}`}>
          <TaskSectionLabel>{label}</TaskSectionLabel>
          <Component taskId={taskId} title={taskTitle} onClose={onClose} />
          {/* <TaskSectionImageContent
                     hasContent={dueDate}
                     ContentComponent={DueDateFieldContent}
                     ContentComponentProps={{ recurringSchema, dueDate }}
                     DefaultImageComponent={() => <TaskSectionInfoCalendar />}
                   /> */}
        </TaskSectionDisplayDiv>
      ))}
    </>
  );
}
