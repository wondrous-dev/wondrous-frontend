import { Box } from "@mui/material";
import { TaskSectionLabel } from "../helpers";
import { TaskSectionDisplayDiv, TaskSectionInfoText, ActionButton } from "../styles";

interface ApplicationFieldProps {
    shouldDisplay: boolean;
    taskApplicationCount?: any;
    handleReviewButton?: any;
  }
  
  
export default function ApplicationField({ shouldDisplay, taskApplicationCount, handleReviewButton }: ApplicationFieldProps) {
    if (!shouldDisplay) return null;
    return (
      <TaskSectionDisplayDiv>
        <TaskSectionLabel>Applications</TaskSectionLabel>
        <Box display="flex" alignItems="center">
          <TaskSectionInfoText>
            <ActionButton type="button" onClick={handleReviewButton}>
              Review {taskApplicationCount?.getTaskApplicationsCount?.total} applications
            </ActionButton>
          </TaskSectionInfoText>
        </Box>
      </TaskSectionDisplayDiv>
    );
  }
  