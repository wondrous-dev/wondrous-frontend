import { Grid } from "@mui/material";
import ErrorField from "components/Shared/ErrorField";
import TextField from "components/Shared/TextField";
import { ErrorText } from "components/Shared/styles";
import { useContext } from "react";
import CreateQuestContext from "utils/context/CreateQuestContext";

type QuestTitleProps = {
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
  showMaxLength?: boolean;
  stateKey?: string;
};

const QuestTitle = ({
  value,
  onChange = null,
  placeholder = "Enter a quest title",
  multiline = false,
  maxLength = 125,
  showMaxLength = false,
  stateKey,
}: QuestTitleProps) => {
  const { errors, setErrors } = useContext(CreateQuestContext);
  const handleChange = (value) => {
    if (!onChange) return null;
    if (errors?.[stateKey]) {
      setErrors({
        ...errors,
        title: null,
      });
    }
    onChange(value);
  };
  return (
    <Grid container flexDirection="column" gap="4px" position="relative" width="100%">
      <Grid container gap="0" flexDirection="column" borderRadius="6px" overflow="hidden">
        <Grid container item lineHeight="0">
          <TextField
            onChange={handleChange}
            multiline={multiline}
            placeholder={placeholder}
            value={value}
            borderRadius="0px"
          />
        </Grid>
        {showMaxLength ? (
          <Grid
            container
            item
            bgcolor="#e8e8e8"
            justifyContent="flex-end"
            alignItems="center"
            padding="14px"
            fontSize="13px"
            color="#2A8D5C"
            fontWeight="500"
          >
            {value.length} / 125
          </Grid>
        ) : null}
      </Grid>
      {errors?.[stateKey] ? <ErrorField errorText={errors?.[stateKey]} /> : null}
    </Grid>
  );
};

export default QuestTitle;
