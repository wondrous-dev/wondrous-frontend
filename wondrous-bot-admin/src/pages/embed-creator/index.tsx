import { Grid } from "@mui/material";
import MessageCreateComponent from "components/DiscordEmbeds/MessageCreate";
import MessagePreviewComponent from "components/DiscordEmbeds/MessagePreview";
import { useState } from "react";
import { EmbedCreatorContext } from "utils/context/EmbedCreatorContext";

const EmbedCreatorPage = () => {
  const [message, setMessage] = useState({});
  return (
    <EmbedCreatorContext.Provider
      value={{
        message,
        setMessage,
      }}
    >
      <Grid display="flex">
        <MessageCreateComponent />
        <MessagePreviewComponent />
      </Grid>
    </EmbedCreatorContext.Provider>
  );
};

export default EmbedCreatorPage;
