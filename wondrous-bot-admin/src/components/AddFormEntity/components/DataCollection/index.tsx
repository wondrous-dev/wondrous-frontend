import Grid from "@mui/material/Grid";
import TextField from "components/Shared/TextField";
import { useContext } from "react";
import { DATA_COLLECTION_TYPES, SKILLS } from "utils/constants";
import GlobalContext from "utils/context/GlobalContext";
import { Label } from "../styles";
import SelectComponent from "components/Shared/Select";
import InterestsComponent from "./InterestsComponent";
import LocationComponent from "./Location";
import Skills from "./Skills";
import { ErrorText } from "components/Shared/styles";

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

const getDefaultOptions = (type) => {
  if (type === DATA_COLLECTION_TYPES.INTERESTS) {
    return ["web3", "other"];
  }
  if (type === DATA_COLLECTION_TYPES.SKILLS) {
    return ["blockchain_fundamentals", "other"];
  }
  return null;
};
const DataCollectionComponent = (props) => {
  const { activeOrg } = useContext(GlobalContext);
  const { error, value, onChange } = props;
  const { prompt, dataCollectionProps, options = [] } = value;
  const { dataCollectionType, category } = dataCollectionProps || {};

  const handleOnChange = (key, val) => {
    onChange({
      ...value,
      [key]: val,
    });
  };

  const handleTypeChange = (type) => {
    return onChange({
      ...value,
      dataCollectionProps: {
        ...dataCollectionProps,
        dataCollectionType: type,
      },
      options: getDefaultOptions(type),
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
        <SelectComponent onChange={handleTypeChange} value={dataCollectionType} options={OPTIONS} error={error?.additionalData?.dataCollectionType}/>
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
          handleOnChange={(options) => handleOnChange("options", options)}
          options={options}
        />
      ) : null}
      {dataCollectionType === DATA_COLLECTION_TYPES.LOCATION ? <LocationComponent /> : null}
      {dataCollectionType === DATA_COLLECTION_TYPES.SKILLS ? (
        <Skills options={options} error={error} handleOnChange={(options) => handleOnChange("options", options)} />
      ) : null}
    </Grid>
  );
};

export default DataCollectionComponent;
