import { useLazyQuery, useQuery } from "@apollo/client";
import { Grid } from "@mui/material";
import CreateTemplate from "components/CreateTemplate";
import DeleteQuestButton from "components/DeleteQuestButton";
import PageHeader from "components/PageHeader";
import ShareComponent from "components/Share";

import { SharedSecondaryButton } from "components/Shared/styles";
import ViewQuestResults from "components/ViewQuestResults";
import { GET_QUEST_BY_ID, GET_CMTY_PAYMENT_COUNTS } from "graphql/queries";
import moment from "moment";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { QUEST_STATUSES } from "utils/constants";
import { transformQuestConfig } from "utils/transformQuestConfig";
import CreateQuestContext from "utils/context/CreateQuestContext";
import QuestTitle from "components/QuestTitle";

const QuestResultsPage = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const location = useLocation();
  const isEditInQuery = new URLSearchParams(location.search).get("edit") === "true";
  const [isEditMode, setIsEditMode] = useState(isEditInQuery);
  let { id } = useParams();
  const [title, setTitle] = useState("");
  const handleNavigationToNewQuest = () => navigate("/quests/create");
  const headerActionsRef = useRef(null);

  const { ref, inView, entry } = useInView({
    threshold: 1,
  });

  const setRefValue = (value) => (headerActionsRef.current = value);

  const { data: { getQuestById } = {} } = useQuery(GET_QUEST_BY_ID, {
    variables: {
      questId: id,
    },
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setTitle(data?.getQuestById?.title);
    },
    skip: !id,
  });

  const toggleEdit = () => setIsEditMode((prev) => !prev);

  const questSettings = {
    title: getQuestById?.title || "",
    level: getQuestById?.level ? String(getQuestById?.level) : null,
    timeBound: getQuestById?.startAt || getQuestById?.endAt,
    isOnboarding: getQuestById?.isOnboarding || false,
    maxSubmission: getQuestById?.maxSubmission || null,
    requireReview: getQuestById?.requireReview || false,
    isActive: getQuestById?.status === QUEST_STATUSES.OPEN || false,
    startAt: getQuestById?.startAt ? moment(getQuestById?.startAt) : null,
    endAt: getQuestById?.endAt ? moment(getQuestById?.endAt) : null,
    questConditions: getQuestById?.conditions
      ? getQuestById?.conditions?.map((condition) => {
          const { __typename, ...rest } = condition?.conditionData;
          return {
            type: condition?.type,
            conditionData: rest,
          };
        })
      : null,
    rewards: [
      {
        value: getQuestById?.pointReward || 0,
        type: "points",
      },
    ],
  };

  const questSteps = useMemo(() => {
    if (!isEditMode) return [];

    return transformQuestConfig(getQuestById?.steps);
  }, [getQuestById?.steps, isEditMode]);

  return (
    <CreateQuestContext.Provider
      value={{
        errors,
        setErrors,
        isEditMode,
      }}
    >
      <PageHeader
        title={getQuestById?.title || ""}
        titleComponent={isEditMode ? () => <QuestTitle title={title} setTitle={setTitle} /> : null}
        withBackButton
        onBackButtonClick={() => {
          if (isEditMode) {
            toggleEdit();
          }
        }}
        renderActions={() => (
          <Grid display="flex" gap="10px" alignItems="center">
            <DeleteQuestButton questId={getQuestById?.id} />
            <ShareComponent link={`/quest/${getQuestById?.id}`} />
            {isEditMode ? (
              <>
                <SharedSecondaryButton $reverse onClick={toggleEdit}>
                  Cancel
                </SharedSecondaryButton>

                <SharedSecondaryButton
                  onClick={async () => {
                    await headerActionsRef.current?.handleSave();
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
          title={title}
          displaySavePanel={!inView}
          defaultQuestSettings={questSettings}
          questId={id}
          postUpdate={toggleEdit}
          defaultQuestSteps={questSteps}
        />
      ) : (
        <ViewQuestResults quest={getQuestById} />
      )}
    </CreateQuestContext.Provider>
  );
};

export default QuestResultsPage;
