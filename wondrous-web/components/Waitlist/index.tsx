import React, { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { TextField } from '@material-ui/core'

import WaitlistConfirmation from './confirm'
import { JoinWaitListButton, HomeButtonText, CloseModalButton } from './styles'
import { useIsMobile } from '../../utils/hooks'
import styled from 'styled-components'
import ClearIcon from '@material-ui/icons/Clear'
import { useQuery, useMutation } from '@apollo/client'
import { CREATE_WAISTLIST_USER } from '../../graphql/mutations'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Grid from '@material-ui/core/Grid'
import { device } from '../../utils/device'
import { createSpacingUnit } from '../../utils'
import { Orange, White, Grey10, Red400 } from '../../services/colors'

const JoinWaitListFormContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: row;
`

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
const WaitlistTextField = styled(TextField)(({ theme }) => ({
	'& label.Mui-focused': {
		color: 'blue',
	},
	'& .MuiInput-underline:after': {
		borderBottomColor: 'white',
	},
	'& .MuiInput-underline:before': {
		borderBottomColor: 'white',
	},
	'& .MuiFormLabel-root': {
		color: White,
	},
	'.MuiInputBase-input': {
		color: White,
	},
	'& .MuiInputBase-root-root': {
		color: White,
	},
	'& .MuiInput-underline:hover:not(.Mui-disabled):before': {
		borderBottomColor: White,
	},
	'& .MuiInputLabel-shrink': {
		color: '#8d6fea !important',
	},
}))

const JoinWaitList = ({ showJoinWaitList, setShowJoinWaitList }) => {
	const [createWaitlistUser, { data, loading, error }] = useMutation(
		CREATE_WAISTLIST_USER
	)
	const [addedToWaitlist, setAddedToWaitlist] = useState(false)
	const formik = useFormik({
		initialValues: {
			email: '',
		},
		onSubmit: async (values) => {
			await createWaitlistUser({ variables: { email: values.email } })
			// alert(JSON.stringify(values, null, 2))
			setAddedToWaitlist(true)
		},
		validationSchema: Yup.object({
			email: Yup.string().email('Invalid email address'),
		}),
	})

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

	return (
		<ModalWrapper>
			{!addedToWaitlist && (
				<>
					<form onSubmit={formik.handleSubmit} style={{ width: '80%' }}>
						{/* <JoinWaitListFormContainer> */}
						<Grid container alignItems="center" justify="center" spacing={3}>
							<Grid item md={1} xs={false} />
							<Grid item md={8} xs={12}>
								<div>
									<WaitlistTextField
										fullWidth
										name="email"
										label="email"
										color="primary"
										onChange={formik.handleChange}
										value={formik.values.email}
										onBlur={formik.handleBlur}
									/>
									{formik.touched.email && formik.errors.email ? (
										<div style={{ color: Red400 }}>{formik.errors.email}</div>
									) : null}
									{error && <div style={{ color: Red400 }}>Unknown error</div>}
								</div>
							</Grid>
							<CenteredGrid item md={3} xs={12}>
								<JoinWaitListButton type="submit">
									<HomeButtonText nowrap>Join waitlist</HomeButtonText>
								</JoinWaitListButton>
							</CenteredGrid>
						</Grid>
						{/* </JoinWaitListFormContainer> */}
					</form>
				</>
			)}
			{addedToWaitlist && (
				<WaitlistConfirmation
					waitlistPosition={data?.createWaitlistUser?.position}
				/>
			)}
			<CloseModalButton
				aria-label="Close modal"
				onClick={() => setShowJoinWaitList(false)}
			/>
		</ModalWrapper>
	)
}

export default JoinWaitList
