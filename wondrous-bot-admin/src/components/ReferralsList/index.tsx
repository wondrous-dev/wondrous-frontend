import { Box } from "@mui/material";
import PageWrapper from "components/Shared/PageWrapper";
import { BG_TYPES } from "utils/constants";

const ReferralsList = () => {
  return (
    <PageWrapper
      bgType={BG_TYPES.QUESTS}
      containerProps={{
        minHeight: "100vh",
        flexDirection: "column",
        gap: "42px",
        padding: {
          xs: "14px 14px 120px 14px",
          sm: "24px 56px",
        },
      }}
    >
      <Box />
    </PageWrapper>
  );
};

export default ReferralsList;
