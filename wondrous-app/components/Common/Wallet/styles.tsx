import { IconButton } from '@material-ui/core'
import styled from 'styled-components'
import { Background, Black95 } from '../../../theme/colors'

export const WalletWrapper = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;

	max-width: 280px;
	margin-right: 20px;
`

export const ChainWrapper = styled(IconButton)`
	&& {
		width: 40px;
		height: 40px;
		background: #1e1e1e;
		border-radius: 4px;
		margin-right: 20px;
	}
`

export const WalletConnectButton = styled(IconButton)`
	&& {
		width: 200px;
		height: 40px;
		background: #1e1e1e;
		border-radius: 4px;
		margin-right: 20px;
	}
`

export const WalletDisplay = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	width: 219px;
	height: 40px;

	border-radius: 3px;

	padding: 0 4px;

	background: ${Black95};
`

export const WonderBalance = styled.div`
	display: flex;
	flex-grow: 1;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	min-width: 65px;

	cursor: pointer;

	margin-right: 10px;
`

export const WalletAddress = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;

	width: 126px;
	height: 32px;

	border-radius: 3px;

	background: ${Background};

	font-size: 14px;
	font-weight: 600;
`

export const CurrencySelectorItem = styled.div`
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	justify-content: flex-start;
`

export const CurrencySymbol = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	width: 30px;
	height: 32px;
`

export const CurrencyName = styled.div`
	display: flex;
	flex-grow: 1;
	flext-direction: column;
	align-items: center;
`
