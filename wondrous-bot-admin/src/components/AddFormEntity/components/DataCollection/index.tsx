import Grid from "@mui/material/Grid";
import TextField from "components/Shared/TextField";
import { useContext, useEffect, useMemo, useState } from "react";
import { DAO_CATEGORIES, DATA_COLLECTION_TYPES, SKILLS, TYPES } from "utils/constants";
import GlobalContext from "utils/context/GlobalContext";

import { getInterestsPerCategory } from "utils/dataCollection";
import { IndexContainer, Label } from "../styles";
import SelectComponent from "components/Shared/Select";
import InterestsComponent from "./InterestsComponent";
import LocationComponent from "./Location";
import Skills from "./Skills";

const OPTIONS = [
  {
    label: "Interests",
    value: DATA_COLLECTION_TYPES.INTERESTS,
  },
  {
    label: "Location",
    value: DATA_COLLECTION_TYPES.LOCATION,
  },
  {
    label: "Skills",
    value: DATA_COLLECTION_TYPES.SKILLS,
  },
];
const DataCollectionComponent = (props) => {
  const { activeOrg } = useContext(GlobalContext);
  const { error, value, onChange } = props;
  const { prompt, dataCollectionProps } = value;
  const { dataCollectionType, skills = [], interests = [], location = null, category } = dataCollectionProps || {};

  const handleOnChange = (key, val) => {
    onChange({
      ...value,
      [key]: val,
    });
  };

  // useEffect(() => {
  //   if (category && !interests?.length) {
  //     handleOnChange("dataCollectionProps", {
  //       ...dataCollectionProps,
  //       interests: getInterestsPerCategory(category),
  //     });
  //   }
  //   if (!category && activeOrg?.category) {
  //     handleOnChange("dataCollectionProps", {
  //       ...dataCollectionProps,
  //       category: activeOrg.category,
  //     });
  //   }
  // }, [category, activeOrg]);

  const handleTypeChange = (value) => {
    return handleOnChange("dataCollectionProps", {
      ...dataCollectionProps,
      dataCollectionType: value,
    });
  };

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
        <Label>Select what you want to collect</Label>
        <SelectComponent onChange={handleTypeChange} value={dataCollectionType} options={OPTIONS} />
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
      {dataCollectionType === DATA_COLLECTION_TYPES.INTERESTS ? (
        <InterestsComponent
          error={error}
          handleOnChange={handleOnChange}
          dataCollectionProps={dataCollectionProps}
          interests={interests}
        />
      ) : null}
      {dataCollectionType === DATA_COLLECTION_TYPES.LOCATION ? <LocationComponent /> : null}
      {dataCollectionType === DATA_COLLECTION_TYPES.SKILLS ? (
        <Skills
          skills={skills}
          error={error}
          handleOnChange={handleOnChange}
          dataCollectionProps={dataCollectionProps}
        />
      ) : null}
    </Grid>
  );
};

export default DataCollectionComponent;
