import { Box, Typography } from "@mui/material";
import { CHAIN_SELECT_OPTIONS } from "components/CreateTemplate/RewardUtils";
import { Label } from "components/CreateTemplate/styles";

const ChainInfo = ({
    chain,
}) => {
    const info = CHAIN_SELECT_OPTIONS.find((option) => option.value === chain);
    return (
        <Box display="flex" alignItems="center" gap="6px" justifyContent={"center"} width="100%">
            {info?.icon}
            <Typography color="black" fontSize="14px" fontFamily="Poppins" fontWeight={500}>
        {info?.label}
      </Typography>
        </Box>
    );
};

export default ChainInfo;