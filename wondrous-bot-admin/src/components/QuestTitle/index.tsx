import { Box } from "@mui/material";
import TextField from "components/Shared/TextField";
import { ErrorText } from "components/Shared/styles";
import { useContext } from "react";
import CreateQuestContext from "utils/context/CreateQuestContext";

const QuestTitle = ({ value, onChange, placeholder = "Enter a quest title", key = "title", multiline = false }) => {
  const { errors, setErrors } = useContext(CreateQuestContext);
  const handleChange = (value) => {
    if (errors?.[key]) {
      setErrors({
        ...errors,
        title: null,
      });
    }
    onChange(value);
  };
  return (
    <Box display="flex" flexDirection="column" gap="4px" position="relative" width="100%">
      <TextField
        onChange={handleChange}
        multiline={multiline}
        placeholder={placeholder}
        value={value}
        maxLength={220}
      />
      {errors?.[key] ? (
        <ErrorText
          sx={{
            position: "absolute",
            top: "100%",
          }}
        >
          {errors?.[key]}
        </ErrorText>
      ) : null}
    </Box>
  );
};

export default QuestTitle;
