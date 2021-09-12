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
	ResendLinkButton,
	ResendLink,
} from './styles'
import { createSpacingUnit } from '../../utils'
import { useMutation } from '@apollo/client'
import { RESEND_VERIFICATION_CODE } from '../../graphql/mutations'

const VerificationCodeInput = styled(ReactCodeInput)`
	&& {
		input {
			font-size: 16px;
			font-family: Inter;
			font-weight: bolder;
		}
	}
`
const PhoneVerification = ({
	verificationCode,
	setVerificationCode,
	setCompleteFunc,
	phoneNumber,
}) => {
	const isMobile = useIsMobile()
	const [resendVerificationCode] = useMutation(RESEND_VERIFICATION_CODE)
	const onChange = useCallback(
		(vals) => {
			if (vals.length <= 6) {
				setVerificationCode(vals)
				if (vals.length === 6) {
					setCompleteFunc(vals)
				}
			}
		},
		[setVerificationCode, setCompleteFunc]
	)

	return (
		<Container>
			<JoinWaitlistHeader variant="h4">
				Enter your 6-digit verification code
			</JoinWaitlistHeader>
			<VerificationCodeInput onChange={onChange} autoFocus={true} />

			<ResendLink
				nowrap
				variant="body1"
				onClick={async () => {
					// Verify phone number
					resendVerificationCode({
						variables: {
							phoneNumber,
						},
					})
				}}
			>
				Resend Verification code
			</ResendLink>
		</Container>
	)
}

export default PhoneVerification
