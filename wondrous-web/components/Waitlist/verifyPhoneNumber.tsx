import React, { useState, useCallback, useEffect } from 'react'
import Trackable from '../Trackable'
import SmartLink from '../SmartLink'
import Image from 'next/image'
import { Button, Modal, TextField, Typography } from '@material-ui/core'
import ReactCodeInput from 'react-verification-code-input'
import { useIsMobile } from '../../utils/hooks'
import styled from 'styled-components'
import {
	Container,
	Subtext,
	JoinWaitlistHeader,
	ResendLink,
	ErrorDiv,
	SmallerCenteredDiv,
} from './styles'
import { createSpacingUnit } from '../../utils'
import { useMutation } from '@apollo/client'
import { RESEND_VERIFICATION_CODE } from '../../graphql/mutations'
import { device } from '../../utils/device'
import HomeNavbar from '../Navbar/Home'

const VerificationCodeInput = styled(ReactCodeInput)`
	&& {
		input {
			font-size: 16px;
			font-family: Inter;
			font-weight: bolder;

			@media ${device.mobileL} {
				width: 48px !important;
			}

			@media ${device.mobileS} {
				width: 40px !important;
			}
		}
	}
`
const PhoneVerification = ({
	verificationCode,
	setVerificationCode,
	setCompleteFunc,
	phoneNumber,
	error,
	setError,
	setOpen,
}) => {
	const isMobile = useIsMobile()
	const [resendVerificationCode, { data, loading, error: resendError }] =
		useMutation(RESEND_VERIFICATION_CODE)
	const onChange = useCallback(
		(vals) => {
			if (vals.length <= 6) {
				setVerificationCode(vals)
				if (vals.length < 6) {
					setError(null)
				}
				if (vals.length === 6) {
					setCompleteFunc(vals)
				}
			}
		},
		[setVerificationCode, setCompleteFunc, setError]
	)
	const resendErrorMsg =
		'Too many attempts reached to send code. Please try again later'
	return (
		<Container>
			<HomeNavbar />
			<SmallerCenteredDiv>
				<JoinWaitlistHeader variant="h4">
					Enter your 6-digit verification code
				</JoinWaitlistHeader>
				<VerificationCodeInput onChange={onChange} autoFocus={true} />

				<ResendLink
					nowrap
					variant="body1"
					onClick={async () => {
						// Verify phone number
						try {
							setError(null)
							await resendVerificationCode({
								variables: {
									phoneNumber,
								},
							})
							setOpen(true)
						} catch (err) {
							setError(resendErrorMsg)
						}
					}}
				>
					Resend Verification code
				</ResendLink>
				{error && (
					<ErrorDiv>{error || (resendError && resendErrorMsg)}</ErrorDiv>
				)}
			</SmallerCenteredDiv>
		</Container>
	)
}

export default PhoneVerification
