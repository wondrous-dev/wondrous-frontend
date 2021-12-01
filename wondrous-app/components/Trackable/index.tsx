import React from 'react'

/**
 * Trackable is a HOC that tracks mouse clicks over any WrappedComponent
 * @param {string} trackingComponentName - the override for the tracked name of wrapped component
 *
 * NOTE: All WrappedComponent must accept an onClick parameter and handle it. This is usually handled
 * at the root level HTML element in WrappedComponent.
 */
const Trackable = (
	WrappedComponent,
	{ trackingComponentName }: { trackingComponentName?: string } = {},
	...props
) => {
	return class extends React.Component<IProps, IState> {
		displayName: string = `Trackable(${getDisplayName(WrappedComponent)})`

		constructor(props) {
			super(props)

			this.onClick = this.onClick.bind(this)
		}

		/**
		 * load analytics client asynchronously since not available server-side
		 */
		componentDidMount() {
			this.setState({
				// TODO: integrate analytics client here
				// analytics: getAnalyticsClient()
			})
		}

		onClick(originalEvent) {
			// const { analytics } = this.state
			const { eventName, eventParameters, onClick } = this.props

			// if (analytics) {
			// 	// first, track click analytics
			// 	const componentName = trackingComponentName
			// 		? trackingComponentName
			// 		: getDisplayName(WrappedComponent)
			// 	analytics.logEvent(`click.${componentName}`)

			// 	// then, track any additional, custom analytics
			// 	if (eventName && eventParameters) {
			// 		analytics.logEvent(eventName, eventParameters)
			// 	}
			// }

			// then, continue with onClick specified for WrappedComponent
			if (onClick) {
				onClick(originalEvent)
			}
		}

		render() {
			return <WrappedComponent {...this.props} onClick={this.onClick} />
		}
	}
}

const getDisplayName = (WrappedComponent) => {
	return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

interface IProps {
	onClick?: (e: any) => void
	eventName?: string
	eventParameters?: object
}

interface IState {
	// analytics: TODO:
}

export default Trackable
