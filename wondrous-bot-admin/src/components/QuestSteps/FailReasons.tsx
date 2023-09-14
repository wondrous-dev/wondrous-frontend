import { useLazyQuery } from "@apollo/client";
import { Box, Grid, Typography } from "@mui/material";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import { TextLabel } from "components/ViewQuest/styles";
import { GET_QUEST_BY_ID } from "graphql/queries";
import { useEffect, useMemo, useState } from "react";

const FailedReasonBody = ({ failReason }) => {
  const [label, setLabel] = useState("");

  const [getQuestById, { data }] = useLazyQuery(GET_QUEST_BY_ID, {
    onCompleted: (data) => {
      setLabel(`${data.getQuestById.title}`);
    },
  });

  useEffect(() => {
    if (failReason.reason === "quest") {
      getQuestById({
        variables: {
          questId: failReason.questId,
        },
      });
    }
  }, [failReason, getQuestById]);

  const generateLabel = useMemo(() => {
    if (failReason.reason === "level") {
      return <TextLabel>Min level: <b>{failReason.level}</b></TextLabel>
      // return `Min level: ${failReason.level}`;
    }
    if (failReason.reason === "only_once") {
      return <TextLabel>You've made the maximum number of submissions for this quest</TextLabel>
    }
    if(!label) return null;
    return <TextLabel>Complete <b>{label}</b> quest</TextLabel>;
  }, [failReason, label]);

  return (
    <Box display="flex" flexDirection="column" gap="14px" padding="8px" bgcolor="#EAEAEA" borderRadius="12px">
      <Box minHeight="40px" display="flex" justifyContent="center" alignItems="center" width="100%" gap="6px">
       {generateLabel}
      </Box>
    </Box>
  );
};

const FailReasons = ({ reasons }) => {
  return (
    <PanelComponent
      renderHeader={() => (
        <Grid
          padding="14px"
          bgcolor="#F7F7F7"
          sx={{
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
          }}
        >
          <Typography fontFamily="Poppins" color="black" fontSize="14px" fontWeight={600} lineHeight="15px">
            Woops! You can't take this quest
          </Typography>
        </Grid>
      )}
      renderBody={() => (
        <Grid display="flex" justifyContent="center" alignItems="center" flexDirection="column" width="100%" gap="24px">
          <Typography color="black" fontFamily="Poppins" fontSize="14px" fontWeight={700} lineHeight="14px">
            Requiremenets not met
          </Typography>
          <Grid display="flex" flexDirection="column" gap="16px" width="calc(100% - 84px)">
            {reasons?.map((reason, idx) => (
              <FailedReasonBody failReason={reason} key={`reason-${idx}`} />
            ))}
          </Grid>
        </Grid>
      )}
    />
  );
};

export default FailReasons;
