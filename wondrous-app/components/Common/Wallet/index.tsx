import React from 'react'
import Ethereum from '../../Icons/ethereum'
import { WonderCoin } from '../../Icons/wonderCoin'

import {
	WalletWrapper,
	ChainWrapper,
	WalletDisplay,
	WonderBalance,
	WalletAddress,
} from './styles'

const Wallet = ({ wallet }) => {
	return (
		<WalletWrapper>
			<ChainWrapper>
				<Ethereum />
			</ChainWrapper>
			<WalletDisplay>
				<WonderBalance>
					{wallet.wonder}
					&nbsp;
					<WonderCoin />
				</WonderBalance>
				<WalletAddress>{wallet.address}</WalletAddress>
			</WalletDisplay>
		</WalletWrapper>
	)
}

export default Wallet
