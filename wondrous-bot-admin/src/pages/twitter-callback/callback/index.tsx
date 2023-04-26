import { useMutation } from "@apollo/client"
import { Typography } from "@mui/material"
import Grid from "@mui/material/Grid"
import { VERIFY_COMMUNITY_USER_TWITTER } from "graphql/mutations"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

const CallbackPage = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const code = searchParams?.get("code")
	const state = searchParams?.get("state")
	const discordId = state?.split("discordId=")[1] || ""
	const [finishedVerification, setFinishedVerification] = useState(false)
	const [errorText, setErrorText] = useState("")
	const [verifyTwitter] = useMutation(VERIFY_COMMUNITY_USER_TWITTER, {
		onCompleted: () => {
			setFinishedVerification(true)
		},
		onError: (e) => {
			console.error("error verifying twitter", e)
			setErrorText("Error verifying twitter - please try again")
		}
	})
	useEffect(() => {
		if (code && discordId) {
			verifyTwitter({
				variables: {
					code,
					discordId
				}
			})
		}
	}, [code, discordId])

	return (
		<Grid display='flex' flexDirection='column' height='100%' minHeight='100vh'>
			<Grid
				flex='1'
				display='flex'
				justifyContent='center'
				alignItems='center'
				gap='8px'
				flexDirection='column'
			></Grid>
			<Grid
				flex='1'
				sx={{
					backgroundImage: "url(/images/home-bg.png)",
					backgroundPosition: "bottom",
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover"
				}}
				position='relative'
			></Grid>
		</Grid>
	)
}

export default CallbackPage
