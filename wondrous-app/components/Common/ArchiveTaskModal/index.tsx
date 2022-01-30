import * as Constants from '../../../utils/constants'
import CloseModalIcon from '../../Icons/closeModal'
import { ArchivedIcon } from '../../Icons/statusIcons'
import {
    StyledArchivedLabel,
    StyledArchiveTaskButton,
    StyledBody,
    StyledBox,
    StyledButtonsContainer,
    StyledCancelButton,
    StyledCloseButton,
    StyledDialog,
    StyledDivider,
    StyledHeader
} from './styles'
import { useMutation } from '@apollo/client'
import { DELETE_TASK_PROPOSAL } from '../../../graphql/mutations'
import { GET_ORG_TASK_BOARD_TASKS } from '../../../graphql/queries'
import { GET_PER_STATUS_TASK_COUNT_FOR_ORG_BOARD } from '../../../graphql/queries'
import { useOrgBoard } from '../../../utils/hooks'
import { removeProposalItem } from '../../../utils/board'

export const ArchiveTaskModal = (props) => {
    const { open, onClose, onArchive, taskType, taskId = "" } = props
    const board = useOrgBoard()
    const [deleteTaskProposal] = useMutation(DELETE_TASK_PROPOSAL, {
        refetchQueries: () => [
            {
                query: GET_ORG_TASK_BOARD_TASKS,
                variables: board?.getOrgTasksVariables,
            },
            {
                query: GET_PER_STATUS_TASK_COUNT_FOR_ORG_BOARD,
                variables: board?.getOrgBoardTaskCountVariables
            }
        ],
    })

    const isTaskOrMilestone = taskType === Constants.TASK_TYPE || taskType === Constants.MILESTONE_TYPE

    const handleArchiveOrDelete = () => {
        if (isTaskOrMilestone) {
            onArchive(Constants.TASK_STATUS_ARCHIVED);
        } else {
            board?.setFirstTimeFetch(false)
            deleteTaskProposal({
                variables: { proposalId: taskId }
            }).then(() => {
                const updatedColumn = removeProposalItem(taskId, board.columns)
                board.setColumns(updatedColumn)
            }).catch((err) => {
                console.error(err)
            })
        }
        onClose();
    }

    return (
        <>
            <StyledDialog
                open={open}
                onClose={onClose}
                aria-labelledby="archive-task-modal"
                aria-describedby="modal-modal-description"
            >
                <StyledBox>
                    <StyledCloseButton onClick={onClose}>
                        <CloseModalIcon />
                    </StyledCloseButton>
                    <StyledHeader>
                        {isTaskOrMilestone ? `Archive this ${taskType}?` : 'Delete this task proposal?'}
                    </StyledHeader>
                    <StyledBody>
                        {isTaskOrMilestone ? "You can undo this in the archived section in the board." : "You cannot undo this action."}
                    </StyledBody>
                    <StyledDivider />
                    <StyledButtonsContainer>

                        <StyledCancelButton onClick={onClose}>
                            Cancel
                        </StyledCancelButton>
                        <StyledArchiveTaskButton>
                            <ArchivedIcon />
                            <StyledArchivedLabel onClick={handleArchiveOrDelete}>
                                {isTaskOrMilestone ? `Archive ${taskType}?` : 'Delete task proposal'}
                            </StyledArchivedLabel>
                        </StyledArchiveTaskButton>
                    </StyledButtonsContainer>
                </StyledBox>
            </StyledDialog>
        </>
    )
}