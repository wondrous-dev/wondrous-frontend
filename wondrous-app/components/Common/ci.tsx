import React, { SVGProps } from 'react'
import styled from 'styled-components'


export const Logo = (props: SVGProps<SVGSVGElement>) => (
	<svg
		className="logo"
		viewBox="0 0 43 31"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			d="M29.818 8.315c-.026.131-.131.236-.288.288a11.29 11.29 0 0 0-7.662 7.636.385.385 0 0 1-.366.287.385.385 0 0 1-.366-.287c-1.072-3.687-3.974-6.59-7.661-7.636-.157-.052-.262-.157-.288-.288h-.026v-.104h.026c.026-.13.13-.236.288-.288 3.687-1.046 6.59-3.948 7.661-7.635A.385.385 0 0 1 21.502 0c.157 0 .314.105.367.288 1.072 3.687 3.974 6.59 7.661 7.635.157.052.262.157.288.288h.026v.104h-.026Z"
			fill="url(#a)"
		/>
		<path
			d="M1.317 8.368H1.16c-.314 0-.523.34-.366.601l12.603 21.809c.157.261.55.261.707 0l4.602-8.002c.418-.732.444-1.648.026-2.38A23.565 23.565 0 0 0 1.317 8.368Z"
			fill="url(#b)"
		/>
		<path
			d="M41.848 8.368h-.157c-7.531 1.02-13.938 5.622-17.442 12.054-.418.733-.392 1.648.026 2.38l4.629 8.002c.157.261.549.261.706 0L42.214 8.995a.422.422 0 0 0-.366-.627Z"
			fill="url(#c)"
		/>
		<defs>
			<linearGradient
				id="a"
				x1={36.919}
				y1={31}
				x2={36.223}
				y2={0}
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="#CBF" />
				<stop offset={0.474} stopColor="#7427FF" />
				<stop offset={1} stopColor="#00BAFF" />
			</linearGradient>
			<linearGradient
				id="b"
				x1={36.919}
				y1={31}
				x2={36.223}
				y2={0}
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="#CBF" />
				<stop offset={0.474} stopColor="#7427FF" />
				<stop offset={1} stopColor="#00BAFF" />
			</linearGradient>
			<linearGradient
				id="c"
				x1={36.919}
				y1={31}
				x2={36.223}
				y2={0}
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="#CBF" />
				<stop offset={0.474} stopColor="#7427FF" />
				<stop offset={1} stopColor="#00BAFF" />
			</linearGradient>
		</defs>
	</svg>
)

type LogotypeProps = SVGProps<SVGSVGElement> & { dark?: boolean }

export const Logotype = (props: LogotypeProps) => (
	<svg
		className="logotype"
		viewBox="0 0 139 33"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		{...props}
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M114.061 24.84V7.642h-2.777v6.797c-.828-1.39-2.364-2.187-4.196-2.187-3.487 0-6.028 2.837-6.028 6.442 0 3.664 2.541 6.471 6.028 6.471 1.832 0 3.368-.768 4.196-2.186v1.861h2.777Zm-10.312-6.146c0-2.305 1.566-4.048 3.812-4.048 2.186 0 3.723 1.566 3.723 4.048 0 2.453-1.537 4.048-3.723 4.048-2.276 0-3.812-1.773-3.812-4.048ZM84.808 18.664c.059-3.605-2.837-6.5-6.53-6.441-3.754 0-6.531 2.777-6.531 6.441 0 3.694 2.777 6.472 6.53 6.472a6.338 6.338 0 0 0 6.53-6.472Zm-10.402.03c0-2.275 1.596-4.019 3.871-4.019s3.842 1.744 3.842 4.019c0 2.305-1.567 4.048-3.842 4.048-2.275 0-3.87-1.773-3.87-4.048Z"
			fill={props.dark ? '#000' : '#FFF'}
		/>
		<path
			d="m60.311 12.666-2.748 8.717-2.866-8.835h-3.014l4.343 12.292h2.778l2.778-8.185L64.3 24.84h2.778l4.373-12.292h-2.955l-2.836 8.835-2.808-8.717h-2.54ZM98.991 24.84h-2.777v-6.707c0-2.335-1.035-3.487-3.044-3.487-1.005 0-1.802.354-2.453 1.063-.65.68-.975 1.596-.975 2.66v6.471h-2.777V12.548h2.777v1.861c.71-1.3 2.157-2.186 4.019-2.186 3.25 0 5.23 2.038 5.23 5.703v6.914Z"
			fill="#fff"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M122.985 22.801c-2.028 0-3.589-1.14-3.983-3.073h9.952c.03-.354.059-.798.059-1.33 0-3.604-2.689-6.116-6.353-6.116-3.693 0-6.353 2.777-6.353 6.442 0 3.693 2.778 6.47 6.678 6.47 2.423 0 4.58-1.063 5.615-2.659l-2.157-1.388c-.71 1.004-2.01 1.654-3.458 1.654Zm3.28-5.17c-.118-1.833-1.566-3.104-3.605-3.104-1.832 0-3.28 1.153-3.664 3.103h7.269ZM138.853 15.049v-2.56c-.325-.119-.768-.178-1.359-.178-1.655 0-2.984.946-3.605 2.423v-2.186h-2.778V24.84h2.778v-6.235c0-1.093.325-1.98 1.005-2.66.65-.708 1.536-1.063 2.571-1.063.602 0 1.064.056 1.388.167Zm0 0 .03.01h-.03v-.01Z"
			fill={props.dark ? '#000' : '#FFF'}
		/>
		<path
			d="M29.63 9.112c-.026.132-.132.238-.29.29a11.425 11.425 0 0 0-7.754 7.728.39.39 0 0 1-.37.29.39.39 0 0 1-.371-.29c-1.085-3.731-4.022-6.669-7.754-7.727-.158-.053-.264-.16-.29-.291h-.027v-.106h.026c.027-.133.133-.238.291-.291 3.732-1.059 6.669-3.996 7.754-7.727a.39.39 0 0 1 .37-.291.39.39 0 0 1 .37.29c1.086 3.732 4.023 6.67 7.754 7.728.16.053.265.158.292.29h.026v.107h-.026Z"
			fill="url(#a)"
		/>
		<path
			d="M.787 9.165H.628c-.318 0-.53.344-.37.608l12.754 22.07a.42.42 0 0 0 .715 0l4.657-8.097c.424-.741.45-1.668.027-2.408A23.847 23.847 0 0 0 .787 9.165Z"
			fill="url(#b)"
		/>
		<path
			d="M41.804 9.165h-.159c-7.621 1.032-14.105 5.69-17.65 12.2-.424.74-.398 1.666.026 2.407l4.684 8.098a.42.42 0 0 0 .714 0L42.174 9.8a.427.427 0 0 0-.37-.635Z"
			fill="url(#c)"
		/>
		<defs>
			<linearGradient
				id="a"
				x1={36.816}
				y1={32.068}
				x2={36.112}
				y2={0.697}
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="#CBF" />
				<stop offset={0.474} stopColor="#7427FF" />
				<stop offset={1} stopColor="#00BAFF" />
			</linearGradient>
			<linearGradient
				id="b"
				x1={36.816}
				y1={32.068}
				x2={36.112}
				y2={0.697}
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="#CBF" />
				<stop offset={0.474} stopColor="#7427FF" />
				<stop offset={1} stopColor="#00BAFF" />
			</linearGradient>
			<linearGradient
				id="c"
				x1={36.816}
				y1={32.068}
				x2={36.112}
				y2={0.697}
				gradientUnits="userSpaceOnUse"
			>
				<stop stopColor="#CBF" />
				<stop offset={0.474} stopColor="#7427FF" />
				<stop offset={1} stopColor="#00BAFF" />
			</linearGradient>
		</defs>
	</svg>
)

export const SmallLogo = styled(Logotype)`
	&& {
		max-height: 30px;
		max-width: fit-content;
	}
`