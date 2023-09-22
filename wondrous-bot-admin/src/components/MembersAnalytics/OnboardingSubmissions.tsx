import { Grid } from "@mui/material";
import { CardLabel } from "./styles";
import { SecondaryAccordion } from "./Common";

const OnboardingSubmissions = ({ user }) => {
  return (
    <Grid gap="24px" display="flex" flexDirection="column">
      <CardLabel>Onboarding Submissions</CardLabel>
      <SecondaryAccordion questName="Onboarding subs">yo</SecondaryAccordion>
    </Grid>
  );
};

export default OnboardingSubmissions;
