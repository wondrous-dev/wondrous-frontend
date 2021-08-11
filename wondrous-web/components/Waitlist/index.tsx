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

const JoinWaitListFormContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: row;
`
import { Orange, White } from '../../services/colors'
const ModalWrapper = styled.div`
	&& {
		width: 100%;
		height: 100%;
		position: fixed;
		display: flex;
		justify-content: center;
		align-items: center;
		background: ${Orange};
		flex-direction: column;
	}
`

import { device } from '../../utils/device'
export const CenteredGrid = styled(Grid)`
	&& {
		@media ${device.mobileL} {
			display: flex;
			justify-content: center;
			align-items: center;
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
	'& .MuiInputBase-root-root': {
		color: 'white'
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
			// await createWaitlistUser({ variables: { email: values.email } })
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
										<div>{formik.errors.email}</div>
									) : null}
								</div>
							</Grid>
							<CenteredGrid item md={4} xs={12}>
								<JoinWaitListButton type="submit">
									<HomeButtonText nowrap>Join waitlist</HomeButtonText>
								</JoinWaitListButton>
							</CenteredGrid>
						</Grid>
						{/* </JoinWaitListFormContainer> */}
					</form>
				</>
			)}
			{addedToWaitlist && <WaitlistConfirmation />}
			<CloseModalButton
				aria-label="Close modal"
				onClick={() => setShowJoinWaitList(false)}
			/>
		</ModalWrapper>
	)
}

export default JoinWaitList
