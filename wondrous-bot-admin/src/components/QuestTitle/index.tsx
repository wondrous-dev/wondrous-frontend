import CreateQuestContext from "utils/context/CreateQuestContext";
import { TitleInput } from "components/CreateTemplate/styles";
import { useContext } from "react";
import { Box } from "@mui/material";
import { ErrorText } from "components/Shared/styles";

const QuestTitle = ({ title, setTitle }) => {
  const { errors, setErrors } = useContext(CreateQuestContext);
  const handleChange = (e) => {
    if (errors?.title) {
      setErrors({
        ...errors,
        title: null,
      });
    }
    setTitle(e.target.value);
  };
  return (
    <Box display="flex" flexDirection="column" gap="4px" position="relative">
      <TitleInput
        maxRows={2}
        multiline
        rows={1}
        value={title}
        onChange={handleChange}
        placeholder="Enter Quest Title"
      />
      {errors?.title ? (
        <ErrorText
          sx={{
            position: "absolute",
            top: "100%",
          }}
        >
          {errors?.title}
        </ErrorText>
      ) : null}
    </Box>
  );
};

export default QuestTitle;
