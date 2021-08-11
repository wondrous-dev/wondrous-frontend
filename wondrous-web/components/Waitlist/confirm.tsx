import React, { useState, useCallback, useEffect } from 'react'
import Trackable from '../Trackable'
import SmartLink from '../SmartLink'
import Image from 'next/image'
import { Modal, TextField } from '@material-ui/core'
import JoinWaitList from '../Waitlist'
import { Typography } from '@material-ui/core'
import { useIsMobile } from '../../utils/hooks'
import styled from 'styled-components'
import { Container, Subtext } from './styles'
import { createSpacingUnit } from '../../utils'

const WaitlistConfirmation = () => {
	const isMobile = useIsMobile()

	return (
		<Container>
			<Typography variant="h1">Congratulations!</Typography>
			<Subtext style={{ marginTop: `${createSpacingUnit(4)}px` }}>
				You're on the waitlist
			</Subtext>
		</Container>
	)
}

export default WaitlistConfirmation
