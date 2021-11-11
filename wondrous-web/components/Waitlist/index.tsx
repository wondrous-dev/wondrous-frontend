import React, { useState, useCallback, useEffect } from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { isPossiblePhoneNumber } from 'libphonenumber-js'
import { useRouter } from 'next/router'

import PhoneVerification from './verifyPhoneNumber'
import {
	JoinWaitListButton,
	HomeButtonText,
	CloseModalButton,
	JoinWaitlistHeader,
	CenteredDiv,
	ErrorDiv,
	ModalWrapper,
	ExplanationText,
} from './styles'
import { useIsMobile } from '../../utils/hooks'
import styled from 'styled-components'
import { useQuery, useMutation } from '@apollo/client'
import {
	CREATE_WAITLIST_USER,
	VERIFY_WAITLIST_USER,
} from '../../graphql/mutations'
import Grid from '@material-ui/core/Grid'
import { device } from '../../utils/device'
import { createSpacingUnit } from '../../utils'
import { White } from '../../services/colors'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import { storeAuthWaitlistHeader } from '../Auth/withAuth'
import HomeNavbar from '../Navbar/Home'
import { TokenText } from '../Home/styles'

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />
}

export const CenteredGrid = styled(Grid)`
	&& {
		@media ${device.mobileL} {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: ${createSpacingUnit(2)}px !important;
		}
	}
`

const JoinWaitList = () => {
	const router = useRouter()
	const isMobile = useIsMobile()
	const [verifyPhoneNumber, setVerifyPhoneNumber] = useState(false)
	const [phoneNumber, setPhoneNumber] = useState('')
	const [error, setError] = useState(null)
	const [validNumber, setValidNumber] = useState(null)
	const [verificationCode, setVerificationCode] = useState(null)
	const [open, setOpen] = useState(false)
	const inviteRefCode = router?.query?.ref
	const [createWaitlistUser, { data, loading, error: mutationError }] =
		useMutation(CREATE_WAITLIST_USER)
	const [
		verifyWaitlistUser,
		{ data: verifyData, loading: verifyLoading, error: verifyError },
	] = useMutation(VERIFY_WAITLIST_USER)
	const incorrectVerificationText =
		'Incorrect code. Please try again or resend verification code'
	const completeVerification = useCallback(
		async (verificationCode) => {
			// TODO redirect to invite page with link
			try {
				const result = await verifyWaitlistUser({
					variables: {
						phoneNumber,
						verificationCode,
					},
				})
				const waitlistUser = result?.data?.verifyWaitlistUser?.waitlistUser
				const token = result?.data?.verifyWaitlistUser?.token
				if (waitlistUser) {
					await storeAuthWaitlistHeader(token, waitlistUser)
					router.push('/waitlist/profile')
				} else {
					setError(incorrectVerificationText)
				}
			} catch (err) {
				setError(incorrectVerificationText)
			}
		},
		[phoneNumber, verifyWaitlistUser, router]
	)

	const handleClose = useCallback(() => {
		setOpen(false)
	}, [])
	return (
		<>
			<ModalWrapper>
				<HomeNavbar />
				{!verifyPhoneNumber && (
					<>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<CenteredDiv>
								<JoinWaitlistHeader variant="h3">
									Join our waitlist to get
									<TokenText> 10 $WONDER tokens</TokenText> for free.
								</JoinWaitlistHeader>
								<ExplanationText>
									Please enter your phone number to reserve your tokens.
								</ExplanationText>
								<PhoneInput
									country="us"
									placeholder="Enter phone number"
									value={phoneNumber}
									onChange={(value) => {
										setPhoneNumber(value)
										setError(null)
									}}
									isValid={(inputNumber, country: any, countries) => {
										setValidNumber(
											isPossiblePhoneNumber(
												inputNumber,
												country?.iso2?.toUpperCase()
											)
										)
										return isPossiblePhoneNumber(
											inputNumber,
											country?.iso2?.toUpperCase()
										)
									}}
									inputStyle={{
										height: '48px',
										fontSize: '16px',
										width: '100%',
										background: '#FFFFFF',
										opacity: 0.4,
										paddingLeft: '48px',
										border: 'none !important',
									}}
								/>
								{error && <ErrorDiv>{error}</ErrorDiv>}
								{mutationError && !error && <ErrorDiv>Unknown error</ErrorDiv>}
								<ExplanationText variant="body2">
									(We won’t share any of your information or send you spam.)
								</ExplanationText>
								<JoinWaitListButton
									onClick={async () => {
										// Verify phone number
										// TODO: add loading screen
										if (!validNumber) {
											setError('Please enter a valid phone number')
										} else {
											try {
												const result = await createWaitlistUser({
													variables: {
														phoneNumber,
														...(inviteRefCode && {
															inviteRefCode,
														}),
													},
												})
												const waitlistUser =
													result?.data?.createOrGetWaitlistUser?.waitlistUser
												const token =
													result?.data?.createOrGetWaitlistUser?.token
												if (waitlistUser?.phoneVerified) {
													await storeAuthWaitlistHeader(token, waitlistUser)
													router.push('/waitlist/profile')
												} else {
													setVerifyPhoneNumber(true)
												}
											} catch (err) {
												console.log('err', err)
												setError('Error with connection. Please try again')
											}
										}
									}}
								>
									<HomeButtonText nowrap>Enter the Wonderverse</HomeButtonText>
								</JoinWaitListButton>
							</CenteredDiv>
						</div>
					</>
				)}
				{verifyPhoneNumber && (
					<>
						<PhoneVerification
							verificationCode={verificationCode}
							setVerificationCode={setVerificationCode}
							phoneNumber={phoneNumber}
							setCompleteFunc={completeVerification}
							error={error}
							setError={setError}
							setOpen={setOpen}
						/>
					</>
				)}
				<Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
					<Alert onClose={handleClose} severity="success">
						Verification code sent!
					</Alert>
				</Snackbar>
			</ModalWrapper>
		</>
	)
}

export default JoinWaitList
