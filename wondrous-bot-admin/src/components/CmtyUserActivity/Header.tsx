import { Box, ButtonBase, Typography } from "@mui/material";
import { HeaderBar, HeaderInfoImage } from "./styles";
import { QuestionMark } from "@mui/icons-material";
import { ActiveTutorialIcon } from "components/Icons/Sidebar";

export default function CmtyUserHeaderComponent() {
  return (
    <HeaderBar>
      <Box padding="14px" display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" gap="24px" justifyContent="center" alignItems="center">
          <Box display="flex" alignItems="center" gap="8px">
            <img src="/wonder.svg" />
            <Typography
              fontSize={{
                xs: "14px",
                xl: "16px",
              }}
              fontWeight={500}
              lineHeight="14px"
              color="black"
            >
              Pan - DAO
            </Typography>
          </Box>
          <Typography
            color="#363636"
            fontSize={{
              xs: "12px",
              xl: "14px",
            }}
            fontWeight={500}
            display="flex"
            gap="6px"
            justifyContent="center"
            alignItems="center"
          >
            Powered by <HeaderInfoImage src="/wonder.svg" /> Wonderverse
          </Typography>
        </Box>
        <ButtonBase>
          <ActiveTutorialIcon fill="black" stroke="white" width="24px" height="24px" />
        </ButtonBase>
      </Box>
    </HeaderBar>
  );
}
