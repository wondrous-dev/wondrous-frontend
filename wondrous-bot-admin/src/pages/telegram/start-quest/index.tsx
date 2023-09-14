import QuestSteps from "components/QuestSteps";
import PageWrapper from "components/Shared/PageWrapper";
import { BG_TYPES } from "utils/constants";

export const TelegramStartQuest = () => {
  return (
    <PageWrapper
      containerProps={{
        direction: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: {
          xs: "14px 14px 120px 14px",
          sm: "24px 56px 150px 24px",
        },
      }}
      bgType={BG_TYPES.QUESTS}
    >
      <QuestSteps />
    </PageWrapper>
  );
};

export default TelegramStartQuest;
