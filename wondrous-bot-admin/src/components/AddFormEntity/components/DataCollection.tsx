import { Box, ButtonBase, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import { ButtonIconWrapper } from "components/Shared/styles";
import TextField from "components/Shared/TextField";
import { useContext, useEffect, useMemo, useState } from "react";
import { DAO_CATEGORIES } from "utils/constants";
import GlobalContext from "utils/context/GlobalContext";
import AddIcon from "@mui/icons-material/Add";

import { getInterestsPerCategory } from "utils/dataCollection";
import { IndexContainer, Label } from "./styles";

const DataCollectionComponent = (props) => {
  const { activeOrg } = useContext(GlobalContext);
  const { error, value, onChange } = props;
  const { prompt, dataCollectionProps } = value;
  const {category = null, interests = []} = dataCollectionProps || {};

  const categories = useMemo(() => {
    return Object.keys(DAO_CATEGORIES).map((item) => ({
      label: DAO_CATEGORIES[item],
      key: item,
      isActive: item === category,
    }));
  }, [category]);

  const handleOnChange = (key, val) => {
    onChange({
      ...value,
      [key]: val,
    });
  };

  useEffect(() => {
    if (category && !interests?.length) {
        handleOnChange("dataCollectionProps", {
            ...dataCollectionProps,
            interests: getInterestsPerCategory(category),
        })
    }
    if (!category && activeOrg?.category) {
      handleOnChange("dataCollectionProps", {
        ...dataCollectionProps,
        category: activeOrg.category,
      });
    }
  }, [category, activeOrg]);

  const handleInterestsUpdate = (interests) => {
    handleOnChange("dataCollectionProps", {
        ...dataCollectionProps,
        interests,
    });
  };

  const handleCategoryChange = (category) => {
    handleOnChange("dataCollectionProps", {
        category,
        interests: getInterestsPerCategory(category),
    })
  };

  const removeInterest = (idx) => {
    const newInterests = [...interests];
    newInterests.splice(idx, 1);
    handleInterestsUpdate(newInterests);
  };

  const addInterest = () => handleInterestsUpdate([...interests, ""]);

  return (
    <Grid
      gap="8px"
      display="flex"
      alignItems="center"
      style={{
        width: "100%",
      }}
      direction="column"
    >
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
        <Label
          sx={{
            fontWeight: "400 !important",
            fontSize: "10px !important",
          }}
        >
          This step will collect the user's location.
        </Label>
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
        <Label>Question/Prompt</Label>
        <TextField
          placeholder="Enter prompt here"
          value={prompt || ""}
          onChange={(value) => handleOnChange("prompt", value)}
          multiline={false}
          error={error?.prompt}
        />
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
            {interests?.map((interest, idx) => (
              <Grid display="flex" flexDirection="column" gap="10px">
                <Grid display="flex" alignItems="center" gap="14px" width="100%">
                  <IndexContainer>{idx + 1}.</IndexContainer>
                  <TextField
                    placeholder="Type an answer here"
                    value={interest}
                    error={error?.options?.[idx]?.text}
                    onChange={(value) => {
                      const newInterests = [...interests];
                      newInterests[idx] = value;
                      handleInterestsUpdate(newInterests);
                    }}
                    multiline={false}
                  />
                  <Box display="flex" gap="10px">
                    {interests.length > 1 ? (
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
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DataCollectionComponent;
