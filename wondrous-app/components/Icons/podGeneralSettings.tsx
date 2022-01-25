import React from 'react'

export default function PodGeneralSettings({ circle = false, ...props }) {
	return (
		<svg
			width="61"
			height="61"
			viewBox="0 0 61 61"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			{circle && <circle cx="30.1832" cy="30.817" r="30.1832" fill="#141414" />}
			<ellipse cx="16.1823" cy="22.9882" rx="14.6432" ry="2.47479" stroke="#7A7A7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
			<ellipse cx="16.1823" cy="13.517" rx="14.6432" ry="2.47479" stroke="#7A7A7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
			<ellipse cx="16.1823" cy="4.04925" rx="14.6432" ry="2.47479" stroke="#7A7A7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
		</svg>
	)
}
