import React from 'react'
import styled from 'styled-components'
import {
	Button,
	IconButton,
	Modal,
	TextField,
	Typography,
} from '@material-ui/core'
import { BaseCard } from '../Common/card'
import CreateTaskIcon from '../Icons/createTask'
import CreateMilestoneIcon from '../Icons/createMilestone'
import CreatePodIcon from '../Icons/createPod'
import CreateDaoIcon from '../Icons/createDao'
import { LogoSquare } from '../Common/ci'

export const CreateModalOverlay = styled(Modal)`
	position: relative;
	width: 100%;
	overflow-y: scroll;
`

export const CreateLayoutsModal = styled(BaseCard)`
	&& {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 330px;
		z-index: 2100;
	}
`

export const CreateLayoutsModalHeader = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
`

export const CreateLayoutsModalTitle = styled(Typography)`
	&& {
		font-weight: bold;
		font-size: 18px;
		line-height: 23px;
		color: white;
		background: -webkit-linear-gradient(
			180deg,
			#ccbbff -5.62%,
			#7427ff 45.92%,
			#00baff 103.12%
		);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
`

export const CreateLayoutsModalCloseButton = styled(IconButton)`
	&& {
		width: 34px;
		height: 34px;
		padding: 0;
		background: #2d2e2d;
	}
`

export const CreateLayoutsModalItemContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	align-items: center;
`

export const CreateLayoutsModalItem = styled.div`
	width: 100%;
	height: 50px;
	background: #0f0f0f;
	border-radius: 6px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10px 15px;
	margin-bottom: 6px;
	cursor: pointer;
	transition: all 0.15s ease-in-out;

	&:hover {
		background: #262626;
	}
`

export const CreateLayoutsModalItemTitleBlock = styled.div`
	display: flex;

	& svg {
		margin-right: 10px;
	}
`

export const CreateLayoutTaskIcon = styled(CreateTaskIcon)`
	margin-right: 10px;
`

export const CreateLayoutMilestoneIcon = styled(CreateMilestoneIcon)`
	margin-right: 10px;
`

export const CreateLayoutPodsIcon = styled(CreatePodIcon)`
	margin-right: 10px;
`

export const CreateLayoutDaoIcon = styled(CreateDaoIcon)`
	margin-right: 10px;
`

export const CreateLayoutDaoMenuItemIcon = styled(LogoSquare)`
	width: 20px;
	height: 20px;
	margin-right: 10px;
`

export const CreateFormMainBlockTitle = styled(Typography)`
	&& {
		font-weight: 500;
		font-size: 14px;
		line-height: 18px;
		letter-spacing: 0.01em;
		color: #ccbbff;
		margin-bottom: 10px;
	}
`

export const CreateLayoutsModalItemTitle = styled(Typography)`
	&& {
		font-weight: 500;
		font-size: 15px;
		line-height: 19px;
		display: flex;
		align-items: center;
		color: #ffffff;
	}
`

export const CreateFormBaseModal = styled(BaseCard)`
	width: 680px;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -20%);

	& .hbhroD > *:not(:last-child) {
		margin-bottom: 0;
	}
`

export const CreateFormBaseModalHeader = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
	padding: 0 40px 25px;

	& svg {
		width: 60px;
		height: 60px;
		margin-right: 10px;
	}
`

export const CreateFormBaseModalCloseBtn = styled(IconButton)`
	&& {
		position: absolute;
		right: 20px;
		top: 20px;
		width: 35px;
		height: 35px;
		background: #0f0f0f;
	}
`

export const CreateFormBaseModalTitle = styled(Typography)`
	&& {
		font-weight: bold;
		font-size: 20px;
		line-height: 26px;
		color: #ffffff;
	}
`

export const CreateFormMainSection = styled.div`
	max-width: 635px;
	width: 100%;
	padding: 35px 40px 10px;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 0 auto;
	border-top: 1px solid #363636;
	border-bottom: 1px solid #363636;

	& .hbhroD > *:not(:last-child) {
		margin-bottom: 16px;
	}
`

export const CreateFormMainSelects = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	margin-bottom: 25px;
`

export const CreateFormMainInputBlock = styled.div`
	position: relative;
	width: 100%;
	margin-bottom: 28px;

	& .MuiTextField-root {
		width: 100%;
	}
`

export const CreateFormMainTitleInput = styled(TextField)({
	'& .MuiInputBase-root': {
		background: '#0F0F0F',
		borderRadius: 6,
		width: '100% !important',
		height: 40,
		padding: '10px 15px',

		'& .MuiTextField-root': {
			width: '100%',
		},

		//text
		fontSize: 14,
		lineHeight: '19px',
		letterSpacing: '0.01em',
		color: '#C4C4C4',

		'& .MuiFormControl-root': {
			width: '100% !important',
		},

		'&.MuiInput-underline:before': {
			display: 'none',
			width: '100% !important',
		},
	},
})

export const CreateFormMainDescriptionInput = styled(CreateFormMainTitleInput)({
	'& .MuiInputBase-root': {
		height: 156,
	},
})

export const CreateFormMainDescriptionInputSymbolCounter = styled(Typography)`
	&& {
		position: absolute;
		right: 15px;
		bottom: 15px;

		font-size: 12px;
		line-height: 19px;
		letter-spacing: 0.01em;
		color: #7a7a7a;
	}
`

//Task Requirements Block
export const CreateFormTaskRequirements = styled.div`
	width: 100%;
	padding: 35px 40px 55px;
	border-bottom: 1px solid #363636;
`

export const CreateFormTaskRequirementsTitle = styled(Typography)`
	&& {
		font-weight: 500;
		font-size: 14px;
		line-height: 18px;
		letter-spacing: 0.01em;
		color: #ccbbff;
		margin-bottom: 10px;
	}
`

export const CreateFormTaskRequirementsContainer = styled.div`
	max-width: 515px;
	width: 100%;
	min-height: 100px;
	height: 100px;
	display: flex;
	flex-wrap: wrap;
`

export const CreateFormTaskRequirementsItem = styled.div`
	display: flex;
	align-items: center;
	margin-right: 80px;
	width: 90px;
	cursor: pointer;

	& svg {
		margin-right: 10px;
	}
`

export const CreateFormTaskRequirementsItemText = styled(Typography)`
	&& {
		font-size: 14px;
		line-height: 19px;
		letter-spacing: 0.01em;
		color: #c4c4c4;
	}
`

//Add more details block
export const CreateFormAddDetailsSection = styled.div`
	position: relative;
	width: 100%;
`

export const CreateFormAddDetailsButton = styled(Button)`
	&& {
		position: absolute;
		top: -20px;
		left: 50%;
		transform: translateX(-50%);
		background: #0f0f0f;
		height: 40px;
		padding: 9px 15px;

		//text
		font-weight: bold;
		font-size: 14px;
		line-height: 18px;
		color: #707070;
	}
`

export const CreateFormAddDetailsAppearBlock = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`

export const CreateFormAddDetailsAppearBlockContainer = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-direction: column;
	padding: 55px 40px 35px;
	border-bottom: 1px solid #363636;
`

export const CreateFormAddDetailsInputs = styled(CreateFormMainSelects)``

export const CreateFormAddDetailsInputBlock = styled.div`
	width: 262px;
`

export const CreateFormAddDetailsInputLabel = styled(Typography)`
	&& {
		font-weight: 500;
		font-size: 14px;
		line-height: 18px;
		letter-spacing: 0.01em;
		color: #ccbbff;
		margin-bottom: 10px;
	}
`

export const CreateFormAddDetailsInput = styled(CreateFormMainTitleInput)`
	&& {
		width: 100%;
	}
`

export const CreateFormAddDetailsSelects = styled(CreateFormMainSelects)`
	height: 70px;
`

export const CreateFormAddDetailsSwitch = styled.div`
	width: 260px;
`

//members section
export const CreateFormMembersSection = styled.div`
	width: 100%;
	height: 280px;
`

export const CreateFormMembersSectionInput = styled(CreateFormMainTitleInput)`
	&& {
		width: 100%;
		margin-bottom: 15px;
	}
`

export const CreateFormMembersBlock = styled.div`
	width: 100%;
`

export const CreateFormMembersBlockTitle = styled(Typography)`
	&& {
		font-size: 12px;
		line-height: 19px;
		letter-spacing: 0.01em;
		color: #7a7a7a;
	}
`

export const CreateFormLinkAttachmentBlock = styled.div`
	width: 100%;
	padding: 40px 40px 0;
	border-bottom: 1px solid #363636;
`

export const CreateFormLinkAttachmentLabel = styled(Typography)`
	&& {
		font-weight: 500;
		font-size: 14px;
		line-height: 18px;
		letter-spacing: 0.01em;
		color: #ccbbff;
		margin-bottom: 10px;
	}
`

export const CreateFormLinkAttachmentInput = styled(CreateFormMainTitleInput)`
	width: 100%;
`

//bottom buttons
export const CreateFormFooterButtons = styled.div`
	width: 100%;
	display: flex;
	justify-content: right;
	margin-top: 30px;
`

export const CreateFormButtonsBlock = styled.div`
	height: 40px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`

export const CreateFormCancelButton = styled(Button)`
	&& {
		width: 96px;
		height: 100%;
		background: #232323;

		//text
		font-weight: 500;
		font-size: 16px;
		line-height: 150%;
		color: #ffffff;
	}
`

export const CreateFormPreviewButton = styled(Button)`
	&& {
		padding: 8px 12px;
		height: 40px;
		background: #0f0f0f;
		border: 1px solid deepskyblue;
		margin-left: 25px;

		//text
		font-weight: 500;
		font-size: 16px;
		line-height: 150%;
		color: #ffffff;
	}
`
