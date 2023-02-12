import { DefaultUserImage } from "components/Common/Image";
import { useRouter } from "next/router";
import { TaskSectionLabel, TaskSectionImageContent } from "../helpers";
import { TaskSectionDisplayDiv } from "../styles";
import { InfoText } from "./Shared";

export default function ProposerField({ shouldDisplay, creatorUsername, creatorProfilePicture, handleClose }) {
    const router = useRouter();
    if (!shouldDisplay) return null;
    return (
      <TaskSectionDisplayDiv>
        <TaskSectionLabel>Proposer</TaskSectionLabel>
        <TaskSectionImageContent
          hasContent={creatorUsername}
          onClick={() => {
            handleClose();
            router.push(`/profile/${creatorUsername}/about`, undefined, {
              shallow: true,
            });
          }}
          ContentComponent={InfoText}
          ContentComponentProps={{
            content: creatorUsername,
          }}
          imgSrc={creatorProfilePicture}
          DefaultImageComponent={() => <DefaultUserImage />}
          DefaultContent={InfoText}
        />
      </TaskSectionDisplayDiv>
    );
  }
  