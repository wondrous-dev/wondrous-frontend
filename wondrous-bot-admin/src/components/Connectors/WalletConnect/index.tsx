import WalletConnect from "components/Icons/Login/walletconnect.svg"
import WonderAbstractConnector from "../AbstractConnector"

export default function WalletConnectConnector({
	text = "Log in with WalletConnect",
	style
}: {
	text?: string
	style?: any
}) {
	return (
		<WonderAbstractConnector
			connectorName='walletConnect'
			icon={<img src={WalletConnect} />}
			showText={false}
			buttonContent={""}
			style={style}
		/>
	)
}
