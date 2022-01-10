import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { Typography } from '@material-ui/core'
import styled from 'styled-components'
import { Button } from '@material-ui/core'
import { LinkIcon } from '../Icons/linkIcon'

export const StyledTable = styled(Table)`
	width: 100%;
	overflow: hidden;
	margin: 25px 0;
`

export const StyledTableBody = styled(TableBody)`
	border: 1px solid #232323;
	border-radius: 3px;
`

export const StyledTableContainer = styled(TableContainer)``

export const StyledTableHead = styled(TableHead)`
	& .MuiTableCell-head {
		color: #ccbbff;
		border: none;
		font-family: 'Space Grotesk';
		font-size: 14px;
		font-style: normal;
		font-weight: 700;
		letter-spacing: 0em;
	}
`

export const StyledTableRow = styled(TableRow)`
	& .MuiTableCell-body {
		border: 1px solid #232323;
		padding: 14px;
	}

	& .MuiTableCell-root {
		vertical-align: top;
	}
`

export const StyledTableCell = styled(TableCell)`
	svg {
		width: 28px;
		height: 28px;
	}
`

export const TaskTitle = styled(Typography)`
	&& {
		font-weight: bold;
		font-size: 16px;
		color: #ffffff;
	}
`

export const TaskDescription = styled(Typography)`
	&& {
		font-size: 14px;
		line-height: 19px;
		letter-spacing: 0.01em;
		color: #c4c4c4;
	}
`

export const RewardContainer = styled.div`
	display: flex;
	justify-content: center;

	svg {
		width: 16px;
	}
`

export const Reward = styled.div`
	width: 60px;
	height: 28px;
	background: #1f1f1f;
	border-radius: 300px;
	display: flex;
	align-items: center;
	padding: 7px 8px;
`

export const RewardAmount = styled(Typography)`
	&& {
		color: #ffffff;
		font-weight: 600;
		font-size: 13px;
	}
`

export const DeliverableContainer = styled.div`
	display: flex;
	flex-direction: row;
`

export const DeliverableItem = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	color: #7a7a7a;
	width: 29px;
	margin-left: 15px;

	:first-child {
		margin-left: 0;
	}
`

export const DeliverablesIconContainer = styled(Button)`
	&& {
		width: 29px;
		height: 29px;
		min-width: 0;
		background: #1d1d1b;
		border-radius: 2px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 7px;
	}
`

export const StyledLinkIcon = styled(LinkIcon)`
	&& {
		width: 28px;
		height: 28px;
		margin: 0;
	}
`

export const MoreOptions = styled(Button)`
	&& {
		width: 24px;
		height: 24px;
		min-width: 0;
		border-radius: 100%;
		color: #545454;
	}

	svg {
		height: 24px;
	}
`
