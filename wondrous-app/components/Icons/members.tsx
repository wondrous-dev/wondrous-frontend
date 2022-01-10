import React from 'react'

export default function MembersIcon({ circle = false, ...props }) {
	return (
		<svg
			width="61"
			height="61"
			viewBox="0 0 61 61"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			{circle && (
				<circle cx="30.1832" cy="30.2777" r="30.1832" fill="#141414" />
			)}
			<path
				d="M35.8736 42.1514V39.5128C35.8736 38.1132 35.3176 36.7709 34.3279 35.7813C33.3382 34.7916 31.996 34.2356 30.5964 34.2356H21.3612C19.9616 34.2356 18.6193 34.7916 17.6296 35.7813C16.64 36.7709 16.084 38.1132 16.084 39.5128V42.1514"
				stroke="#7A7A7A"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M25.9784 28.9585C28.8929 28.9585 31.2556 26.5958 31.2556 23.6813C31.2556 20.7667 28.8929 18.4041 25.9784 18.4041C23.0639 18.4041 20.7012 20.7667 20.7012 23.6813C20.7012 26.5958 23.0639 28.9585 25.9784 28.9585Z"
				stroke="#7A7A7A"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M37.1934 28.9584L39.832 31.5971L45.1092 26.3198"
				stroke="#7A7A7A"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
