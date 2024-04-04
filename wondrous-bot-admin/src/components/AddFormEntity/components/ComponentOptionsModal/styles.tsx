import { Box, Button, Grid } from "@mui/material";
import { styled } from "@mui/system";

export const ColumnContainer = styled(Box)`
  && {
    display: flex;
    flex-direction: column;
    gap: 24px;

    ${({ theme }) => theme.breakpoints.up("md")} {
      gap: 0;
      flex-direction: row;
      justify-content: center;
    }
  }
`;

export const OptionsColumnContainer = styled(Box)<{ $showBorder?: boolean }>`
  && {
    display: flex;
    flex-direction: column;
    gap: 24px;

    ${({ theme }) => theme.breakpoints.up("md")} {
      border-left: ${({ $showBorder }) => ($showBorder ? "1px solid #EEEEEE" : "none")};
      padding: 24px;
    }
  }
`;

export const OptionButton = styled(Button)`
  && {
    text-transform: capitalize;
    gap: 1;
    border-radius: 6px;
    align-items: flex-start;
    &:hover: {
      background-color: #ededed;
    }
  }
`;
