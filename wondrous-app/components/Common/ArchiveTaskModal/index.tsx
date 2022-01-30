import { TASK_STATUS_ARCHIVED } from '../../../utils/constants'
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

export const ArchiveTaskModal = (props) => {
    const { open, onClose, onArchive, taskType } = props

    const handleArchive = () => {
        onArchive(TASK_STATUS_ARCHIVED);
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
                        Archive this {taskType}?
                    </StyledHeader>
                    <StyledBody>
                        You can undo this in the archived section in the board.
                    </StyledBody>
                    <StyledDivider />
                    <StyledButtonsContainer>

                        <StyledCancelButton onClick={onClose}>
                            Cancel
                        </StyledCancelButton>
                        <StyledArchiveTaskButton>
                            <ArchivedIcon />
                            <StyledArchivedLabel onClick={handleArchive}>
                                Archive {taskType}
                            </StyledArchivedLabel>
                        </StyledArchiveTaskButton>
                    </StyledButtonsContainer>
                </StyledBox>
            </StyledDialog>
        </>
    )
}