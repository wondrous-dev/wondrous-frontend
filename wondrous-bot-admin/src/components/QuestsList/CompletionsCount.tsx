import { CompletionsCountBox } from "./styles";
import { Box, Typography } from "@mui/material";
import CheckIcon, { LargeCheckIcon } from "components/Icons/Check";
import { useMemo } from "react";

function transformNumberToText(number) {
  if (number < 1000) return number;
  if (number < 1000000) return `${Math.floor((number / 1000) * 100) / 100}k`;
  if (number < 1000000000) return `${Math.floor((number / 1000000) * 100) / 100}m`;
}

const CompletionsCount = ({ completions }) => {
  const completionsCount = useMemo(() => transformNumberToText(completions), [completions]);
  return (
    <CompletionsCountBox
      position="absolute"
      top="14px"
      left="14px"
      display="flex"
      gap="6px"
      justifyContent="center"
      alignItems="center"
      border="1px solid #D9D9D9"
      bgcolor="white"
      borderRadius="6px"
      padding="4px 6px 4px 6px"
    >
      <LargeCheckIcon />
      <Typography color="black" fontFamily="Poppins" fontWeight={500} fontSize="13px" lineHeight="14px">
        {completionsCount}
      </Typography>
    </CompletionsCountBox>
  );
};

export default CompletionsCount;
