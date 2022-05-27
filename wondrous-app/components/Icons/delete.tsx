import React from 'react'

export default function DeleteIcon(props) {
	const { onClick, style } = props
	return (
		<svg
			width={style?.width || '13'}
			height={style?.height || '14'}
			viewBox="0 0 13 14"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			onClick={onClick}
			style={{
				...style,
				cursor: 'pointer',
			}}
		>
			<path d="M1.26489 3.3457H2.46489H12.0649" stroke="#CCBBFF" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M4.26411 3.34531V2.14531C4.26411 1.82705 4.39054 1.52183 4.61558 1.29678C4.84063 1.07174 5.14585 0.945313 5.46411 0.945312H7.86411C8.18237 0.945313 8.4876 1.07174 8.71264 1.29678C8.93768 1.52183 9.06411 1.82705 9.06411 2.14531V3.34531M10.8641 3.34531V11.7453C10.8641 12.0636 10.7377 12.3688 10.5126 12.5938C10.2876 12.8189 9.98237 12.9453 9.66411 12.9453H3.66411C3.34585 12.9453 3.04063 12.8189 2.81558 12.5938C2.59054 12.3688 2.46411 12.0636 2.46411 11.7453V3.34531H10.8641Z" stroke="#CCBBFF" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M5.46411 6.3457V9.9457" stroke="#CCBBFF" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M7.86255 6.3457V9.9457" stroke="#CCBBFF" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
	)
}
