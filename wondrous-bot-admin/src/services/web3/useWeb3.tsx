/*
DEPRECATED
*/

import { useWeb3React } from "@web3-react/core"
import { AbstractConnector } from "@web3-react/abstract-connector"
import { Web3Provider } from "@ethersproject/providers"
import { useContext, useEffect, useState } from "react"
import useInjectedProviderListener from "./useInjectedProviderListener"
import { WonderWeb3Context } from "utils/context/WonderWeb3Context"
import useAlerts from "utils/hooks"

/**
 * Hook that adds additional low-level functionality to web3-react useWeb3React.
 */
export default function useWeb3() {
	const context = useWeb3React<Web3Provider>()
	const {
		connector,
		library,
		chainId,
		account,
		activate,
		deactivate,
		active,
		error
	} = context
	const { provider, setProvider, isActivating, setIsActivating } =
		useContext(WonderWeb3Context)

	const { showError } = useAlerts()

	useEffect(() => {
		if (isActivating && !!connector) {
			setIsActivating(null)
		}
	}, [isActivating, connector, setIsActivating])

	useEffect(() => {
		if (!active) {
			return
		}
		const getProvider = async () => {
			const { provider: prov } = await connector.activate()
			setProvider(prov)
		}
		getProvider()
	}, [active, connector, setProvider])

	// handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
	const isSubscribed = useInjectedProviderListener({
		suppress: !!isActivating,
		connector
	})

	return {
		connector,
		library,
		chainId,
		account,
		deactivate,
		active,
		error,
		isActivating,
		provider,
		isSubscribed
	}
}
