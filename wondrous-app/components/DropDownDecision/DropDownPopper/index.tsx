import {
	DECISION_APPROVE_AND_PAY,
	DECISION_APPROVE_ONLY,
	DECISION_REJECT,
	DECISION_SEND_INTO_REVISION,
} from '../../../utils/constants'
import {
	ApproveAndPayIcon,
	ApproveOnlyIcon,
	RejectIcon,
	SendIntoRevisionIcon,
} from '../../Icons/decisionIcons'
import {
	StyledList,
	StyledListItem,
	StyledListItemIcon,
	StyledListItemText,
	StyledPopper,
} from './styles'

const DECISIONS = [
	[DECISION_SEND_INTO_REVISION, SendIntoRevisionIcon],
	[DECISION_REJECT, RejectIcon],
	[DECISION_APPROVE_ONLY, ApproveOnlyIcon],
	[DECISION_APPROVE_AND_PAY, ApproveAndPayIcon],
]

export const DropDownPopper = (props) => {
	return (
		<StyledPopper {...props}>
			<StyledList>
				{DECISIONS.map(([decision, Icon], i) => (
					<StyledListItem key={i}>
						<StyledListItemIcon alignItems="center">
							<Icon />
						</StyledListItemIcon>
						<StyledListItemText primary={decision} />
					</StyledListItem>
				))}
			</StyledList>
		</StyledPopper>
	)
}
