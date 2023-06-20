import { Box, Grid, Typography } from "@mui/material";
import AccordionComponent from "components/Shared/Accordion";
import ContentComponent from "./ContentComponent";

export const ActiveQuestContent = () => {
  return (
    <ContentComponent title="Activate Quest">
      <Grid display="flex" gap="10px" flexDirection="column">
        <Typography fontFamily="Poppins" fontWeight={500} fontSize="14px" lineHeight="24px" color="black">
          Use this toggle to activate or deactivate the quest.
        </Typography>
        <AccordionComponent
          renderTitle={() => (
            <Typography
              fontFamily="Poppins"
              color="#2a8d5c"
              fontWeight={500}
              fontSize="14px"
              lineHeight="24px"
            >
              What is an <strong>Active Quest?</strong>
            </Typography>
          )}
        >
         <Box padding="10px">
         <Typography fontFamily="Poppins" fontWeight={500} fontSize="14px" lineHeight="24px" color="black">
            An active quest is a quest that is currently running. You can activate or deactivate a quest at any time.
          </Typography>
         </Box>
        </AccordionComponent>
      </Grid>
    </ContentComponent>
  );
};
