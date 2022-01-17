import { StyledAlert, StyledSnackbar } from './styles'

export const SnackbarAlert = (props) => {
    const { anchorOrigin, open, severity, autoHideDuration, onClose } = props

    return (
        <StyledSnackbar
            anchorOrigin={anchorOrigin || {
                vertical: 'top',
                horizontal: 'center'
            }}
            open={open}
            autoHideDuration={autoHideDuration || 5000}
            onClose={onClose}>
            <StyledAlert severity={severity || "success"} icon={false}>
                {props.children}
            </StyledAlert>
        </StyledSnackbar>
    )
}