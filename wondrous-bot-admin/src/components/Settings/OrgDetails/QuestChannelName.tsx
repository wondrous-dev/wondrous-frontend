import { Box, Typography } from "@mui/material";
import { CustomTextField } from "components/AddFormEntity/components/styles";
import { useMemo } from "react";

const QuestChannelName = ({ guildId, channelName, setChannelName, isLoading }) => {
  const handleChange = (e) => setChannelName(e.target.value);


  const message = useMemo(() => {
    if (!guildId) {
      return `You don't have a discord server connected to your community. Please connect a discord server to your community
      to create a quest channel.
`;
    }
    if (!isLoading && !channelName) {
      return `Please start a quest in Discord to create a quest channel.`;
    }

    return null;
  }, [guildId, isLoading, channelName]);
  
  if (message)
    return (
      <Typography fontWeight={500} fontSize="13px" fontFamily="Poppins" color="#4D4D4D">
        {message}
      </Typography>
    );

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="24px"
      justifyContent="flex-start"
      alignItems="flex-start"
      width="100%"
    >
      <Typography fontWeight={500} fontSize="13px" fontFamily="Poppins" color="#4D4D4D">
        This is the title of the channel which will contain all quest activity.
      </Typography>
      <Box display="flex" gap="8px" alignItems="center" width="100%">
        <CustomTextField onChange={handleChange} value={channelName} />
      </Box>
    </Box>
  );
};

export default QuestChannelName;
