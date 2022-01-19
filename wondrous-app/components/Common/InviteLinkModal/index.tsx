import { useState } from 'react'
import {
    StyledModal,
    StyledBox,
    TextHeading,
    TextSubheading,
    CloseButton,
    PersonAddIconWrapper,
    TextHeadingWrapper,
    HeadingWrapper,
    IconTextWrapper,
    InviteThruLinkLabel,
    InviteThruLinkTextField,
    InviteThruLinkButton,
    InviteThruLinkButtonLabel,
    InviteThruLinkTextFieldButtonWrapper,
    StyledDivider,
    InviteThruEmailLabel,
    InviteThruEmailTextFieldButtonWrapper,
    InviteThruEmailTextField,
    InviteThruEmailSelect,
    InviteThruEmailMenuItem,
    InviteThruEmailFormControlSelect,
    InviteThruEmailTextFieldSelectWrapper,
    InviteThruEmailButtonLabel,
    InviteThruEmailButton,
    InviteThruLinkButtonSuccessLabel
} from './styles'
import PersonAddIcon from '../../Icons/personAdd'
import { CopyIcon, CopySuccessIcon } from '../../Icons/copy'

export const InviteLinkModal = (props) => {
    const { open, onClose } = props
    const [copy, setCopy] = useState(false)
    const [selectRole, setSelectRole] = useState("contributor")

    const handleOnClose = () => {
        onClose();
        setCopy(false)
        setSelectRole("contributor")
    }

    const handleOnCopy = () => {
        setCopy(true)
        // TODO: copy to clipboard
    }

    return (
        <StyledModal open={open} onClose={handleOnClose}>
            <StyledBox>
                <HeadingWrapper>
                    <IconTextWrapper>
                        <PersonAddIconWrapper>
                            <PersonAddIcon />
                        </PersonAddIconWrapper>
                        <TextHeadingWrapper>
                            <TextHeading>
                                Share with people and groups
                            </TextHeading>
                            <TextSubheading>
                                Admins can send out 1 of 1 invite links.
                            </TextSubheading>
                        </TextHeadingWrapper>
                    </IconTextWrapper>
                    <CloseButton onClick={handleOnClose} />
                </HeadingWrapper>
                <InviteThruLinkLabel>
                    Invite through universal link
                </InviteThruLinkLabel>
                <InviteThruLinkTextFieldButtonWrapper>
                    <InviteThruLinkTextField variant="outlined" value="1" disabled />
                    {copy ?
                        <InviteThruLinkButton onClick={handleOnCopy}>
                            <InviteThruLinkButtonSuccessLabel>Link copied!</InviteThruLinkButtonSuccessLabel> <CopySuccessIcon />
                        </InviteThruLinkButton> :
                        <InviteThruLinkButton onClick={handleOnCopy}>
                            <InviteThruLinkButtonLabel>Copy link</InviteThruLinkButtonLabel> <CopyIcon />
                        </InviteThruLinkButton>
                    }

                </InviteThruLinkTextFieldButtonWrapper>
                <StyledDivider />
                <InviteThruEmailLabel>
                    Invite through email
                </InviteThruEmailLabel>
                <InviteThruEmailTextFieldButtonWrapper>
                    <InviteThruEmailTextFieldSelectWrapper>
                        <InviteThruEmailTextField />
                        <InviteThruEmailFormControlSelect>
                            <InviteThruEmailSelect value={selectRole} onChange={(e) => setSelectRole(e.target.value)}>
                                <InviteThruEmailMenuItem value="contributor">contributor</InviteThruEmailMenuItem>
                                <InviteThruEmailMenuItem value="admin">admin</InviteThruEmailMenuItem>
                                <InviteThruEmailMenuItem value="core team">core team</InviteThruEmailMenuItem>
                            </InviteThruEmailSelect>
                        </InviteThruEmailFormControlSelect>
                    </InviteThruEmailTextFieldSelectWrapper>
                    <InviteThruEmailButton>
                        <InviteThruEmailButtonLabel>Send invite</InviteThruEmailButtonLabel>
                    </InviteThruEmailButton>
                </InviteThruEmailTextFieldButtonWrapper>
            </StyledBox>
        </StyledModal>
    )
}