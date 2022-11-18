import { Grid, Typography } from '@mui/material';
import { useMe, withAuth } from 'components/Auth/withAuth';
import { ArchiveTaskModal } from 'components/Common/ArchiveTaskModal';
import {
  BoardsCardBody,
  BoardsCardBodyDescription,
  BoardsCardBodyTitle,
  BoardsCardFooter,
  BoardsCardMedia,
} from 'components/Common/Boards/styles';
import DeleteTaskModal from 'components/Common/DeleteTaskModal';
import { SafeImage } from 'components/Common/Image';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import TaskCardMenu from 'components/Common/TaskCardMenu';
import TaskCardPrivacy from 'components/Common/TaskCardPrivacy';
import { GRANTS_ICONS_LABELS_MAP } from 'components/GrantsFilters';
import { IconWrapper } from 'components/GrantsFilters/styles';
import CommentsIcon from 'components/Icons/comments';
import { DueDateIcon } from 'components/Icons/taskModalIcons';
import { RichTextViewer } from 'components/RichText';
import { GrantAmount } from 'components/ViewGrant/Fields';
import { useContext, useState } from 'react';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { formatDateDisplay } from 'utils/board';
import { ENTITIES_TYPES, PERMISSIONS } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import { useOrgBoard, usePodBoard } from 'utils/hooks';
import { BoardWrapper, EndingSoonPill, ItemPill, MenuWrapper } from './styles';

const GrantsBoardCard = ({ grant, handleCardClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [archiveTask, setArchiveTask] = useState(false);
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;

  const [deleteTask, setDeleteTask] = useState(false);
  const { label, icon: Icon } = GRANTS_ICONS_LABELS_MAP[grant.status];
  const coverMedia = grant?.media?.find((media) => media.type === 'image');
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const board = podBoard || orgBoard;
  const { userPermissionsContext } = board;

  const user = useMe();

  const onEdit = () => handleCardClick(grant, `&edit=true`);

  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: grant?.orgId,
    podId: grant?.podId,
  });

  const canEdit =
    permissions.includes(PERMISSIONS.FULL_ACCESS) ||
    permissions.includes(PERMISSIONS.EDIT_TASK) ||
    grant?.createdBy === user?.id;

  const canArchive =
    permissions.includes(PERMISSIONS.MANAGE_BOARD) ||
    permissions.includes(PERMISSIONS.FULL_ACCESS) ||
    grant?.createdBy === user?.id;

  return (
    <>
      <ArchiveTaskModal
        open={archiveTask}
        onArchive={() => {
          setSnackbarAlertOpen(true);
          setSnackbarAlertMessage(`Archived successfully!`);
        }}
        onClose={() => setArchiveTask(false)}
        taskType={ENTITIES_TYPES.GRANT}
        taskId={grant?.id}
      />
      <DeleteTaskModal
        open={deleteTask}
        onClose={() => {
          setDeleteTask(false);
        }}
        taskType={ENTITIES_TYPES.GRANT}
        taskId={grant?.id}
        onDelete={() => {
          setSnackbarAlertOpen(true);
          setSnackbarAlertMessage(`Deleted successfully!`);
        }}
      />
      <BoardWrapper onClick={() => handleCardClick(grant)}>
        <Grid justifyContent="space-between" alignItems="center" container>
          <Grid display="flex" gap="8px" alignItems="center">
            <TaskCardPrivacy privacyLevel={grant?.privacyLevel} />

            <GrantAmount grantAmount={grant.reward} numOfGrant={grant.numOfGrant} />
          </Grid>
          <Grid display="flex" gap="14px">
            <ItemPill>
              <Typography color={palette.white} fontWeight={500} fontSize={14} fontFamily={typography.fontFamily}>
                {grant.applicationsNum} Applications
              </Typography>
            </ItemPill>

            <ItemPill>
              <IconWrapper>
                <Icon />
              </IconWrapper>
              <Typography color={palette.white} fontWeight={500} fontSize={14} fontFamily={typography.fontFamily}>
                {label}
              </Typography>
            </ItemPill>
          </Grid>
        </Grid>
        <BoardsCardBody>
          <BoardsCardBodyTitle>{grant.title}</BoardsCardBodyTitle>
          <BoardsCardBodyDescription>
            <RichTextViewer text={grant.description} />
          </BoardsCardBodyDescription>
          {coverMedia ? (
            <BoardsCardMedia>
              <SafeImage
                width={270}
                objectFit="cover"
                objectPosition="center"
                height="100%"
                layout="responsive"
                src={coverMedia.slug}
                useNextImage
              />
            </BoardsCardMedia>
          ) : null}
        </BoardsCardBody>
        <BoardsCardFooter>
          <EndingSoonPill>
            <DueDateIcon />
            <Typography color={palette.white} fontWeight={500} fontSize={14} fontFamily={typography.fontFamily}>
              Ending {formatDateDisplay(grant.endDate)}
            </Typography>
          </EndingSoonPill>
          <Grid item container gap="10px" width="fit-content" lineHeight="0" alignItems="center">
            {' '}
            <CommentsIcon />
            {grant.comments || 0}
          </Grid>
          <MenuWrapper display="flex" justifyContent="flex-end" flex={1}>
            <TaskCardMenu
              anchorElParent={anchorEl}
              canArchive={canArchive}
              canDelete={canArchive}
              setDeleteTask={setDeleteTask}
              canEdit={canEdit}
              setAnchorElParent={setAnchorEl}
              setArchiveTask={setArchiveTask}
              setEditTask={onEdit}
              taskType={ENTITIES_TYPES.GRANT}
              open
            />
          </MenuWrapper>
        </BoardsCardFooter>
      </BoardWrapper>
    </>
  );
};

export default withAuth(GrantsBoardCard);
