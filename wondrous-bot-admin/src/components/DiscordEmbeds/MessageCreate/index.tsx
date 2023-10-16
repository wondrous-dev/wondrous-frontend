import { Grid } from "@mui/material";
import { useEmbedCreatorContext } from "utils/context/EmbedCreatorContext";
import EditorInput from "../Components/EditorInput";
import EmbedsList from "../Components/EmbedsCreator";

const MessageCreateComponent = () => {
  const { message, setMessage } = useEmbedCreatorContext();

  const handleContentChange = (value) =>
    setMessage((prev) => ({
      ...prev,
      content: value,
    }));

  const handleUsernameChange = (value) =>
    setMessage((prev) => ({
      ...prev,
      username: value,
    }));
  return (
    <Grid width="100%" height="100%">
      <EditorInput type="text" label={"username"} value={message.username} onChange={handleUsernameChange} />
      <EditorInput type="textarea" label={"Content"} value={message.content} onChange={handleContentChange} />
      <EmbedsList />
    </Grid>
  );
};

export default MessageCreateComponent;
