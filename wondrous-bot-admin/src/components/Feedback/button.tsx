// @ts-nocheck
import FeedbackStar from "components/Icons/feedbackStar.png";
import { FeedBackButtonContainer, FeedbackButtonLink, FeedbackButtonText, FeedbackImg } from "./styles";
import { useMe } from "components/Auth";
import { useEffect } from "react";

export const FeedbackButton = () => {
  const user = useMe();
  useEffect(() => {
    (function (w, d, i, s) {
      function l() {
        if (!d.getElementById(i)) {
          const f = d.getElementsByTagName(s)[0];
          const e = d.createElement(s);
          (e.type = "text/javascript"),
            (e.async = !0),
            (e.src = "https://canny.io/sdk.js"),
            f.parentNode.insertBefore(e, f);
        }
      }
      if (typeof w.Canny !== "function") {
        var c = function () {
          c.q.push(arguments);
        };
        (c.q = []),
          (w.Canny = c),
          d.readyState === "complete"
            ? l()
            : w.attachEvent
            ? w.attachEvent("onload", l)
            : w.addEventListener("load", l, !1);
      }
    })(window, document, "canny-jssdk", "script");
    if (user) {
      Canny("identify", {
        appID: "62955abecab11f0b7619ff3f",
        user: {
          // Replace these values with the current user's data
          email: user && user.userInfo && user.userInfo.email ? user.userInfo.email : "no@email.com",
          name: user.username,
          id: user.id,
        },
      });
    }
  }, [user]);
  return (
    <FeedbackButtonLink href="https://wonderverse.canny.io/productfeedback" target="_blank" rel="noreferrer">
      <FeedBackButtonContainer>
        <FeedbackImg src={FeedbackStar} />
        <FeedbackButtonText>Give Feedback</FeedbackButtonText>
      </FeedBackButtonContainer>
    </FeedbackButtonLink>
  );
};
