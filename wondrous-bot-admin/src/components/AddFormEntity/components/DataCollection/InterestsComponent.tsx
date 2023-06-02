import { getInterestsPerCategory } from "utils/dataCollection";
import { Box, ButtonBase, Grid, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ButtonIconWrapper } from "components/Shared/styles";
import AddIcon from "@mui/icons-material/Add";
import { IndexContainer, Label } from "../styles";
import TextField from "components/Shared/TextField";
import { DAO_CATEGORIES } from "utils/constants";
import { useMemo } from "react";

const InterestsComponent = ({ handleOnChange, dataCollectionProps, options, error }) => {
  const { category } = dataCollectionProps;
  const categories = useMemo(() => {
    return Object.keys(DAO_CATEGORIES).map((item) => ({
      label: DAO_CATEGORIES[item],
      key: item,
      isActive: item === category,
    }));
  }, [category]);

  const handleInterestsUpdate = (options) => handleOnChange({ options });

  const handleCategoryChange = (category) => {
    handleOnChange({
      dataCollectionProps: {
        ...dataCollectionProps,
        category,
      },
      options: getInterestsPerCategory(category),
    });
  };

  const removeInterest = (idx) => {
    const newInterests = [...options];
    newInterests.splice(idx, 1);
    handleInterestsUpdate(newInterests);
  };

  const addInterest = () => handleInterestsUpdate([...options, ""]);

  return (
    <>
      <Grid
        item
        gap="14px"
        display="flex"
        flexDirection="column"
        xs={12}
        style={{
          width: "100%",
        }}
      >
        <Label>Categories</Label>
        <Grid display="flex" gap="6px" alignItems="center" flexWrap="wrap">
          {categories.map(({ isActive, label, key }, idx) => (
            <ButtonBase
              onClick={() => handleCategoryChange(key)}
              key={key}
              sx={{
                backgroundColor: isActive ? "#2A8D5C" : "#F2F2F2",
                borderRadius: "6px",
                padding: "6px 12px",
              }}
            >
              <Typography fontFamily="Poppins" fontWeight={600} fontSize="13px" color={isActive ? "#fee2ca" : "black"}>
                {label}
              </Typography>
            </ButtonBase>
          ))}
        </Grid>
      </Grid>
      <Grid
        item
        gap="14px"
        display="flex"
        flexDirection="column"
        xs={12}
        style={{
          width: "100%",
        }}
      >
        <Label>Interests</Label>
        <Grid display="flex" gap="6px" alignItems="center" flexWrap="wrap">
          <Grid display="flex" gap="8px" flexDirection="column" width="100%">
            {options?.map((interest, idx) => (
              <Grid display="flex" flexDirection="column" gap="10px">
                <Grid display="flex" alignItems="center" gap="14px" width="100%">
                  <IndexContainer>{idx + 1}.</IndexContainer>
                  <TextField
                    placeholder="Type an answer here"
                    value={interest}
                    error={error?.options?.[idx]?.text}
                    onChange={(value) => {
                      const newInterests = [...options];
                      newInterests[idx] = value;
                      handleInterestsUpdate(newInterests);
                    }}
                    multiline={false}
                  />
                  <Box display="flex" gap="10px">
                    {options.length > 1 ? (
                      <ButtonIconWrapper onClick={() => removeInterest(idx)}>
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
            {options?.length < 25 ? (
              <Box display="flex" gap="10px" alignItems="center">
                <ButtonIconWrapper onClick={addInterest}>
                  <AddIcon
                    sx={{
                      color: "black",
                    }}
                  />
                </ButtonIconWrapper>
                <Label>Add interest</Label>
              </Box>
            ) : null}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default InterestsComponent;
