import React, { useState, useCallback, useEffect } from 'react'
import { Typography } from '@material-ui/core'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { isPossiblePhoneNumber } from 'libphonenumber-js'

import PhoneVerification from './verifyPhoneNumber'
import {
	JoinWaitListButton,
	HomeButtonText,
	CloseModalButton,
	JoinWaitlistHeader,
	CenteredDiv,
	ErrorDiv,
} from './styles'
import { useIsMobile } from '../../utils/hooks'
import styled from 'styled-components'
import { useQuery, useMutation } from '@apollo/client'
import {
	CREATE_WAISTLIST_USER,
	VERIFY_WAITLIST_USER,
} from '../../graphql/mutations'
import Grid from '@material-ui/core/Grid'
import { device } from '../../utils/device'
import { createSpacingUnit } from '../../utils'
import { White } from '../../services/colors'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />
}

const ModalWrapper = styled.div`
	&& {
		width: 100%;
		height: 100%;
		position: fixed;
		display: flex;
		justify-content: center;
		align-items: center;
		background: linear-gradient(270deg, #c2e9fb 0%, #a1c4fd 50.16%);
		flex-direction: column;
		& .MuiSvgIcon-root {
			fill: ${White};
		}
	}
`

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
const PhoneTextField = styled(PhoneInput)(({ theme }) => ({
	'& input': {
		minHeight: `${createSpacingUnit(6)}px`,
		fontSize: '16px',
	},
}))

const JoinWaitList = ({ showJoinWaitList, setShowJoinWaitList }) => {
	const [
		createWaitlistUser,
		{ data, loading, error: mutationError },
	] = useMutation(CREATE_WAISTLIST_USER)
	const [
		verifyWaitlistUser,
		{ data: verifyData, loading: verifyLoading, error: verifyError },
	] = useMutation(VERIFY_WAITLIST_USER)
	const isMobile = useIsMobile()
	const [verifyPhoneNumber, setVerifyPhoneNumber] = useState(false)
	const [phoneNumber, setPhoneNumber] = useState('')
	const [error, setError] = useState(null)
	const [validNumber, setValidNumber] = useState(null)
	const [verificationCode, setVerificationCode] = useState(null)
	const [open, setOpen] = useState(false)
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
				if (result?.data?.verifyWaitlistUser) {
				} else {
					console.log('what the')
					setError(incorrectVerificationText)
				}
			} catch (err) {
				setError(incorrectVerificationText)
			}
		},
		[phoneNumber, verifyWaitlistUser]
	)
	const keyPress = useCallback(
		(e) => {
			if (e.key === 'Escape' && showJoinWaitList) {
				setShowJoinWaitList(false)
			}
		},
		[setShowJoinWaitList, showJoinWaitList]
	)

	useEffect(() => {
		document.addEventListener('keydown', keyPress)
		return () => document.removeEventListener('keydown', keyPress)
	}, [keyPress])

	const handleClose = useCallback(() => {
		setOpen(false)
	}, [])
	return (
		<ModalWrapper>
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
						{/* <JoinWaitListFormContainer> */}

						<CenteredDiv>
							<JoinWaitlistHeader variant="h4">
								Enter your phone number
							</JoinWaitlistHeader>
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
									width: isMobile ? '300px' : '500px',
								}}
							/>
							{error && <ErrorDiv>{error}</ErrorDiv>}
							{mutationError && <ErrorDiv>Unknown error</ErrorDiv>}
						</CenteredDiv>
						<JoinWaitListButton
							onClick={async () => {
								// Verify phone number
								if (!validNumber) {
									setError('Please enter a valid phone number')
								} else {
									try {
										await createWaitlistUser({
											variables: {
												phoneNumber,
											},
										})
										setVerifyPhoneNumber(true)
									} catch (err) {
										setError('Error with connection. Please try again')
									}
								}
							}}
						>
							<HomeButtonText nowrap>Join waitlist</HomeButtonText>
						</JoinWaitListButton>
						{/* </JoinWaitListFormContainer> */}
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
			<CloseModalButton
				aria-label="Close modal"
				onClick={() => setShowJoinWaitList(false)}
			/>
		</ModalWrapper>
	)
}

export default JoinWaitList
