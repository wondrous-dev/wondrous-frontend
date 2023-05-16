import { useQuery } from "@apollo/client"
import { Grid } from "@mui/material"
import CreateTemplate from "components/CreateTemplate"
import DeleteQuestButton from "components/DeleteQuestButton"
import PageHeader from "components/PageHeader"
import ShareComponent from "components/Share"
import { SharedSecondaryButton } from "components/Shared/styles"
import ViewQuestResults from "components/ViewQuestResults"
import { GET_QUEST_BY_ID } from "graphql/queries"
import moment from "moment"
import { useMemo, useRef, useState } from "react"
import { useInView } from "react-intersection-observer"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { QUEST_STATUSES } from "utils/constants"
import { transformQuestConfig } from "utils/transformQuestConfig"

const QuestResultsPage = () => {
	const navigate = useNavigate()

  const location = useLocation();
  const isEditInQuery = new URLSearchParams(location.search).get("edit") === "true";
  const [isEditMode, setIsEditMode] = useState(isEditInQuery);	
  let { id } = useParams()

	const handleNavigationToNewQuest = () => navigate("/quests/create")

	const headerActionsRef = useRef(null)

	const { ref, inView, entry } = useInView({
		threshold: 1
	})

	const setRefValue = (value) => (headerActionsRef.current = value)

	const { data: { getQuestById } = {} } = useQuery(GET_QUEST_BY_ID, {
		variables: {
			questId: id
		},
		skip: !id
	})

	const toggleEdit = () => setIsEditMode((prev) => !prev)

	const questSettings = {
		title: getQuestById?.title || "",
		level: getQuestById?.level ? String(getQuestById?.level) : null,
		timeBound: getQuestById?.startAt || getQuestById?.endAt,
		maxSubmission: getQuestById?.maxSubmission || null,
		requireReview: getQuestById?.requireReview || false,
		isActive: getQuestById?.status === QUEST_STATUSES.OPEN || false,
		startAt: getQuestById?.startAt ? moment(getQuestById?.startAt) : null,
		endAt: getQuestById?.endAt ? moment(getQuestById?.endAt) : null,
		questConditions: getQuestById?.conditions
			? getQuestById?.conditions?.map((condition) => {
					const { __typename, ...rest } = condition?.conditionData
					return {
						type: condition?.type,
						conditionData: rest
					}
			  })
			: null,
		rewards: [
			{
				value: getQuestById?.pointReward || 0,
				type: "points"
			}
		]
	}

	const questSteps = useMemo(() => {
		if (!isEditMode) return []

		return transformQuestConfig(getQuestById?.steps)
	}, [getQuestById?.steps, isEditMode])

	return (
		<>
			<PageHeader
				title={getQuestById?.title || ""}
				withBackButton
				onBackButtonClick={() => {
					if (isEditMode) {
						toggleEdit()
					}
				}}
				renderActions={() => (
          <Grid display="flex" gap="10px" alignItems="center">
            <DeleteQuestButton questId={getQuestById?.id}/>
            <ShareComponent />
            						{isEditMode ? (
							<>
								<SharedSecondaryButton $reverse onClick={toggleEdit}>
									Cancel
								</SharedSecondaryButton>

								<SharedSecondaryButton
									onClick={async () => {
										await headerActionsRef.current?.handleSave()
									}}
								>
									Save Quest
								</SharedSecondaryButton>
							</>
						) : (
								<SharedSecondaryButton onClick={toggleEdit}>Edit Quest</SharedSecondaryButton>
						)}
					</Grid>
				)}
			/>
			{isEditMode && getQuestById ? (
				<CreateTemplate
					setRefValue={setRefValue}
          title={getQuestById?.title}
					displaySavePanel={!inView}
					defaultQuestSettings={questSettings}
					questId={id}
					postUpdate={toggleEdit}
					defaultQuestSteps={questSteps}
				/>
			) : (
				<ViewQuestResults quest={getQuestById} />
			)}
		</>
	)
}

export default QuestResultsPage