import React, { useEffect } from "react";

const RewardfulTag = () => {
  useEffect(() => {
    // Rewardful initialization
    (window as any)._rwq = "rewardful";
    window["rewardful"] =
      window["rewardful"] ||
      function () {
        (window["rewardful"].q = window["rewardful"].q || []).push(arguments);
      };

    // Create script element
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://r.wdfl.co/rw.js";
    script.dataset.rewardful = "751ce4";
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div></div>;
};

export default RewardfulTag;
