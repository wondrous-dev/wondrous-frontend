import React from 'react'

export default function UploadImageIcon(props) {
	const { style } = props
	return (
		<svg
			width={style?.width || '39'}
			height={style?.height || '37'}
			viewBox="0 0 39 37"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			style={style}
		>
			<path
				d="M37.0203 23.8732V31.6721C37.0203 32.7063 36.5996 33.6981 35.851 34.4294C35.1023 35.1607 34.0868 35.5715 33.028 35.5715H5.08211C4.0233 35.5715 3.00785 35.1607 2.25915 34.4294C1.51046 33.6981 1.08984 32.7063 1.08984 31.6721L1.08984 23.8732"
				stroke="#707070"
				strokeWidth="2"
			/>
			<path
				d="M9.07422 14.1246L19.0549 23.8731L29.0356 14.1246"
				stroke="#707070"
				strokeWidth="2"
			/>
			<path
				d="M19.0547 23.8732L19.0547 0.476624"
				stroke="#707070"
				strokeWidth="2"
			/>
		</svg>
	)
}
