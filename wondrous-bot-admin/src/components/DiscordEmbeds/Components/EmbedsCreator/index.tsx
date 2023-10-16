import { Box, FormControl, Grid, Typography } from "@mui/material";
import { Label } from "components/QuestsList/styles";
import AccordionComponent from "components/Shared/Accordion";
import { useEmbedCreatorContext } from "utils/context/EmbedCreatorContext";

const EmbedComponent = ({ embed = null, onChange = null }) => {
  const FORM_FIELDS = [
    {
      name: "Author",
      value: embed?.author?.name,
    },
    {
      name: "Author URL",
      value: embed?.author?.url,
      type: "url",
    },
    {
      name: "Author Icon URL",
      value: embed?.author?.icon_url,
      type: "url",
    },
    {
      name: "Title",
      value: embed?.title,
    },
    {
      name: "Description",
      value: embed?.description,
      type: "textarea",
    },
    {
      name: "URL",
      value: embed?.url,
      type: "url",
    },
    {
      name: "Color",
      value: embed?.color,
      component: "color",
    },
    {
      name: "Image URL",
      value: embed?.image?.url,
    },
    {
      name: "Thumbnail URL",
      value: embed?.thumbnail?.url,
    },
    {
      name: "Footer",
      value: embed?.footer?.text,
    },
    {
      name: "Footer Icon URL",
      value: embed?.footer?.icon_url,
    },
    {
      name: "Timestamp",
      component: "timestamp",
      value: embed?.timestamp,
    },
    { name: "Fields", component: "fields", value: embed?.fields },
  ];
  return (
    <FormControl>
      <Grid>
        {FORM_FIELDS.map((field, idx) => (
          <Box key={`field-${idx}`} sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          </Box>
        ))}
      </Grid>
    </FormControl>
  );
};

const EmbedsList = () => {
  const { message, setMessage } = useEmbedCreatorContext();

  return (
    <Grid>
      <Label>Embeds</Label>
      {message?.embeds?.map((embed, idx) => (
        <AccordionComponent
          summaryProps={{
            bgColor: "#FFEBDA",
          }}
          renderTitle={() => (
            <Typography fontFamily="Poppins" color="black" fontWeight={500} fontSize="14px" lineHeight="24px">
              Embed <strong>{idx + 1}</strong>
            </Typography>
          )}
        >
          <EmbedComponent embed={embed} onChange={() => {}} />
        </AccordionComponent>
      ))}
      {!message?.embeds?.length && <EmbedComponent />}
    </Grid>
  );
};

export default EmbedsList;
