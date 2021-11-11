import React from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'
import { White } from '../../services/colors'

interface IconType {
	color?: string
	style: any
}

const DiscordShare = (iconConfig: IconType) => (
	<svg
		width={(iconConfig.style && iconConfig.style.width) || '21'}
		height={(iconConfig.style && iconConfig.style.width) || '18'}
		viewBox="0 0 21 18"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		style={iconConfig.style}
	>
		<path
			d="M8.27375 2.02698C8.11476 1.58503 7.95432 1.13944 7.9514 1.1336C7.87483 0.962219 7.69761 0.854285 7.51091 0.873246C7.39277 0.882727 4.59742 1.12339 2.80629 2.56373C1.86989 3.42866 0 8.48553 0 12.8576C0 12.9349 0.0196907 13.01 0.0583429 13.0771C1.34991 15.3452 4.8709 15.9388 5.67311 15.9644C5.67822 15.9651 5.68259 15.9651 5.68697 15.9651C5.82845 15.9651 5.96118 15.8973 6.04578 15.7828L6.91363 14.6072C5.47985 14.3891 5.22096 14.1047 5.16043 14.0602C4.83662 13.8217 4.59742 13.4877 4.88767 13.0662C5.11083 12.7387 5.57904 12.6308 5.93784 12.8153C6.3054 12.9867 7.28921 13.538 10.21 13.5234C13.1104 13.5147 14.3837 12.9072 14.4019 12.8941C14.8891 12.6745 15.2691 12.765 15.5061 13.0902C15.7883 13.5329 15.587 13.8327 15.2647 14.0704C15.2041 14.1149 15.0576 14.2396 13.5173 14.6042L14.3742 15.782C14.4581 15.8973 14.5915 15.9644 14.733 15.9644C14.7381 15.9644 14.7425 15.9644 14.7469 15.9636C15.5498 15.9381 19.0708 15.3445 20.3617 13.0764C20.4003 13.0093 20.42 12.9342 20.42 12.8569C20.42 8.48553 18.5501 3.42866 17.5904 2.54477C15.8226 1.12412 13.0272 0.883456 12.9091 0.873246C12.7224 0.857202 12.5452 0.962948 12.4686 1.1336C12.4657 1.13944 12.3096 1.59232 12.1587 2.02916C12.1587 2.02916 10.9692 1.85486 10.21 1.85486C9.45081 1.85486 8.27375 2.02698 8.27375 2.02698ZM7.29286 11.3356C6.487 11.3356 5.83429 10.3634 5.83429 9.16304C5.83429 7.96263 6.487 6.99049 7.29286 6.99049C8.10163 6.87016 8.73393 7.96263 8.75143 9.16304C8.75143 10.3634 8.09872 11.3356 7.29286 11.3356ZM13.1271 11.3356C12.3213 11.3356 11.6686 10.3569 11.6686 9.14991C11.6686 7.94294 12.3213 6.96424 13.1271 6.96424C13.933 6.96424 14.5857 7.94294 14.5857 9.14991C14.5857 10.3569 13.933 11.3356 13.1271 11.3356Z"
			fill={iconConfig?.color || White}
		/>
	</svg>
)

export { DiscordShare }
