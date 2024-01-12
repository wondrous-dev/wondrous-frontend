import { Grid, Box } from "@mui/material";
import { SharedShowMoreButton } from "../shared";
import { PanelCount, PanelTitle } from "../shared/styles";

const SubmissionsTable = () => {
  const handleShowMore = () => {};
  return (
    <Grid display="flex" flexDirection="column" gap="18px" width="100%">
      <Box display="flex" alignItems="center" gap="8px" justifyContent="flex-start">
        <PanelCount>
          <PanelTitle>5624</PanelTitle>
        </PanelCount>
        <PanelTitle>submissions</PanelTitle>
      </Box>
      <SharedShowMoreButton onClick={handleShowMore} />
    </Grid>
  );
};

export default SubmissionsTable;
