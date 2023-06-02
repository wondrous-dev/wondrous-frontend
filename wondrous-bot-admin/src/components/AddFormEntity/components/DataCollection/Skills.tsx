import { Box, Grid } from "@mui/material";
import { ButtonIconWrapper } from "components/Shared/styles";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

import TextField from "components/Shared/TextField";
import { IndexContainer, Label } from "../styles";

const Skills = ({ options, error, handleOnChange }) => {
  const handleSkillsUpdate = (options) => {
    handleOnChange("options", options);
  };

  const removeSkill = (idx) => {
    const newSkills = [...options];
    newSkills.splice(idx, 1);
    handleSkillsUpdate(newSkills);
  };

  const addSkill = () => handleSkillsUpdate([...options, ""]);

  return (
    <Grid display="flex" gap="8px" flexDirection="column" width="100%">
      {options?.map((skill, idx) => (
        <Grid display="flex" flexDirection="column" gap="10px" key={idx}>
          <Grid display="flex" alignItems="center" gap="14px" width="100%">
            <IndexContainer>{idx + 1}.</IndexContainer>
            <TextField
              placeholder="Enter a skill here"
              value={skill}
              error={error?.options?.[idx]?.text}
              onChange={(value) => {
                const newSkills = [...options];
                newSkills[idx] = value;
                handleSkillsUpdate(newSkills);
              }}
              multiline={false}
            />
            <Box display="flex" gap="10px">
              {options.length > 1 ? (
                <ButtonIconWrapper onClick={() => removeSkill(idx)}>
                  <CloseIcon
                    sx={{
                      color: "black",
                    }}
                  />
                </ButtonIconWrapper>
              ) : null}
            </Box>
          </Grid>
        </Grid>
      ))}
      {options.length < 25 ? (
        <Box display="flex" gap="10px" alignItems="center">
          <ButtonIconWrapper onClick={addSkill}>
            <AddIcon
              sx={{
                color: "black",
              }}
            />
          </ButtonIconWrapper>
          <Label>Add skill</Label>
        </Box>
      ) : null}
    </Grid>
  );
};

export default Skills;
