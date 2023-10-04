import TextField from "components/Shared/TextField";
import { Divider } from "components/SignupComponent/CollectCredentials/styles";
import SelectComponent from "components/Shared/Select";
import AssetUpload from "./AssetUpload";
import { Box } from "@mui/material";
import { Label } from "components/QuestsList/styles";

export const FormBody = ({ config, handleChange, formData, errors, setErrors, withDivider = true }) => {
  return (
    <>
      {config.map((item, index) => {
        const key = item.key;
        if (item.hide) return null;
        return (
          <Box padding="14px" display="flex" gap="14px" flexDirection="column" key={key}>
            <Box display="flex" flexDirection="column" gap="8px">
              <Label fontSize="14px" color="#4D4D4D">
                {item.label}
              </Label>
              {item.helper ? (
                <Label fontWeight={500} color="#828282" fontSize="13px">
                  {item.helper}
                </Label>
              ) : null}
            </Box>
            {item.component === "input" && (
              <TextField
                value={formData[key]}
                placeholder={item.placeholder}
                error={errors[key]}
                multiline={!!item.multiline}
                onChange={(value) => (item?.onChange ? item?.onChange(value) : handleChange(value, key))}
              />
            )}
            {item.component === "select" && (
              <SelectComponent
                value={formData[key]}
                placeholder={item.placeholder}
                error={errors[key]}
                onChange={(value) => handleChange(value, key)}
                options={item.options}
              />
            )}
            {item.component === "mediaUpload" && (
              <AssetUpload
                error={errors[key]}
                value={formData[key]}
                onChange={(value) => handleChange(value, key)}
                limit={item.limit}
                setError={(value) => setErrors({ ...errors, [key]: value })}
              />
            )}
            {index !== config.length - 1 && (withDivider || item.divider) && <Divider />}
          </Box>
        );
      })}
    </>
  );
};
