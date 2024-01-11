import { Box } from "@mui/material";
import { Label } from "components/AddFormEntity/components/styles";
import ErrorField from "components/Shared/ErrorField";
import Spinner from "components/Shared/Spinner";
import { ErrorText, SharedSecondaryButton } from "components/Shared/styles";
import { useTakeQuest } from "utils/hooks";

export const LinkComponent = ({
  loading,
  link = "",
  onClick,
  label = "Click to verify",
  linkText = "Verify",
  error = null,
}) => {
  const { webApp } = useTakeQuest();

  const handleLinkClick = (link) => {
    onClick?.();
    webApp?.openLink(link, {
      try_instant_view: false,
    });
  };

  return (
    <Box display="flex" flexDirection="column" gap="14px" width="100%">
      {loading ? <Spinner /> : null}
      <Label>{label}</Label>
      {link ? (
        <SharedSecondaryButton onClick={() => handleLinkClick(link)}>{linkText}</SharedSecondaryButton>
      ) : (
        <Box>
          <SharedSecondaryButton onClick={onClick}>{linkText}</SharedSecondaryButton>
        </Box>
      )}
      {error ? <ErrorField errorText={error} /> : null}
    </Box>
  );
};
