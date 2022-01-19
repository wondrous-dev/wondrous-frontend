import {
    StyledCloseButton,
} from './styles'
import CloseModalIcon from '../../Icons/closeModal'

export const ModalCloseButton = (props) => {
    const { onClick } = props

    return (
        <StyledCloseButton onClick={onClick}>
            <CloseModalIcon />
        </StyledCloseButton>
    )
}