import { Box } from "@mui/material";
import { Label } from "components/AddFormEntity/components/styles";
import ErrorField from "components/Shared/ErrorField";
import Spinner from "components/Shared/Spinner";
import { ErrorText, SharedSecondaryButton } from "components/Shared/styles";

export const LinkComponent = ({
  loading,
  link = "",
  onClick,
  label = "Click to verify",
  linkText = "Verify",
  error = null,
}) => {
  return (
    <Box display="flex" flexDirection="column" gap="14px" width="100%">
      {loading ? <Spinner /> : null}
      <Label>{label}</Label>
      {link ? (
        <a
          href={link}
          onClick={onClick}
          style={{
            width: "fit-content",
          }}
        >
          <SharedSecondaryButton>{linkText}</SharedSecondaryButton>
        </a>
      ) : (
        <Box>
          <SharedSecondaryButton onClick={onClick}>{linkText}</SharedSecondaryButton>
        </Box>
      )}
      {error ? <ErrorField errorText={error} /> : null}
    </Box>
  );
};
