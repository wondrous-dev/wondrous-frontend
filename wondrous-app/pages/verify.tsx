import React from 'react'
import { Card, CardBody, CardFooter } from '../components/Common/auth'
import AuthLayout from '../components/Common/Layout/Auth'
import { Line } from '../components/Common/lines'
import { StyledLink } from '../components/Common/text'
import { SmallLogo, LoginWrapper, TopBubble } from '../components/Pages/login'
import { CenteredFlexRow } from '../components/Common/index'
import { useRouter } from 'next/router'

const Verify = () => {
	const { query } = useRouter()
	const email = query.email || 'N/A'

	return (
		<AuthLayout>
			<LoginWrapper>
				<TopBubble src="/images/login/top-floater-bubble.png" alt="" />
				<Card>
					<CardBody>
						<SmallLogo />
						<h1>Instructions sent</h1>
						<p>
							Instructions for resetting your password have been sent to:
							<br />
							<b>{email}</b>
							<br />
							<br />
							<br />
						</p>
						<p>
							You will receive this email within 5 minutes.
							<br />
							<b>Don&apos;t see it? Check your spam.</b>
						</p>
					</CardBody>
					<CardFooter>
						<Line size="80%" />
						<CenteredFlexRow>
							Go back to &nbsp;
							<StyledLink href="/login">Login</StyledLink>?
						</CenteredFlexRow>
					</CardFooter>
				</Card>
			</LoginWrapper>
		</AuthLayout>
	)
}

export default Verify

